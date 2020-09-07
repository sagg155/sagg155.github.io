import React, { Component, Fragment } from "react";
import styled from "styled-components";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import {
  getListIndex,
  getCardIndex,
  getList,
  reorder,
  move
} from "../helpers/kanban";
import { isPositiveNumber } from "../helpers/number";
import { randomId } from "../helpers/random";
import List from "./List";
import EditCard from "./EditCard";
import { UserIcon } from "./Icons";
import { fakeData } from "../data";


const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  overflow-y: scroll;
  min-height: 100vh;
  padding: 50px 40px 30px;

  &::after {
    position: fixed;
    content: "";
    display: block;
    width: 40px;
    height: 100vh;
    right: 0;
    top: 0;
    z-index: 10;
    background: linear-gradient(
      to left,
      rgba(251, 253, 254, 1),
      rgba(251, 253, 254, 0)
    );
  }
`;

const Header = styled.header`
    display: flex;
    margin-left: 5px;
    
    justify-content: space-between;
`;

const Heading = styled.h1`
  font-size: 16px;
`;

const Members = styled.div`
margin-top: 10px;
color: #000000;
flex-direction: row;
margin-right: 15px;
`;

export default class Board extends Component {
  state = {
    data: [],
    showModal: false,
    editListId: "",
    editCardId: "",
    editData: null
  };

  members= [UserIcon, UserIcon, UserIcon];

  componentWillMount = () => {
    this.setState({ data: this.getData() });
  };

  getData = () => {
    const localData = localStorage.getItem("board");
    return localData ? JSON.parse(localData) : fakeData;
  };

  saveDataToLocalstorage = (data) => {
    if (typeof Storage !== "undefined") {
      localStorage.setItem("board", JSON.stringify(data));
    }
  };

  onDragEnd = (result) => {
    const { source, destination } = result;
    const { data: oldData } = this.state;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const list = getList(oldData, source.droppableId);
      if (list) {
        const data = reorder(oldData, list, source.index, destination.index);

        this.setState({ data });
        this.saveDataToLocalstorage(data);
      }
    } else {
      const sourceList = getList(oldData, source.droppableId);
      const destinationList = getList(oldData, destination.droppableId);

      if (sourceList && destinationList) {
        const data = move(
          oldData,
          getList(oldData, source.droppableId),
          getList(oldData, destination.droppableId),
          source,
          destination
        );

        this.setState({ data });
        this.saveDataToLocalstorage(data);
      }
    }
  };

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  addTask = (editListId) => {
    this.setState({ editListId }, () => {
      this.toggleModal();
    });
  };

  editTask = (
    editListId,
    editCardId,
    editData
  ) => {
    this.setState({ editListId, editCardId, editData }, () => {
      this.toggleModal();
    });
  };


  saveTask = (taskInfo) => {
    const { editListId, editCardId, data } = this.state;
    let { task, previousStatus } = taskInfo;

    if (!editListId && !editCardId) {
      return;
    }

    const listIndex = getListIndex(data, editListId);
    const cardIndex = getCardIndex(data[listIndex].items, editCardId);

    if (isPositiveNumber(listIndex) && !isPositiveNumber(cardIndex)) {
      data[listIndex].items.push({
        ...task,
        id: randomId(),
        lastUpdated: new Date().toString(),
      });
    } else if (isPositiveNumber(listIndex) && isPositiveNumber(cardIndex)) {
      if(previousStatus!== task.status) {
        let find;
        switch(previousStatus) {
          case "Planned":
                data[0].items.filter((item, index) => item.id === task.id);
                data[0].items.splice(find,1);
                break;
          case "Started":
                data[1].items.filter((item, index) => item.id === task.id);
                data[1].items.splice(find,1);
                break;
          default:
                data[2].items.filter((item, index) => item.id === task.id);
                data[2].items.splice(find,1)
        }

        switch(task.status) {
          case "Planned":
            data[0].items.push(task);
            break;
          case "Started":
            data[1].items.push(task);
            break;
          default:
            data[2].items.push(task);
        }
      } else {
        data[listIndex].items[cardIndex] = {
          ...task,
          lastUpdated: new Date().toString()
        };
      }
      
    }

    this.setState(
      { data, editData: null, editCardId: "", editListId: "" },
      () => {
        this.toggleModal();
        this.saveDataToLocalstorage(data);
      }
    );
  };

  render() {
    const { data, showModal, editData, editListId, editCardId } = this.state;
    const iconStyle = {};
    iconStyle['color'] = "#000000";
    if (data.length > 0) {
      return (
        <Fragment>
          <Header>
            <Heading>Task Board</Heading>
            <Members>Members:
              {this.members.map((member,index) =>{
                  return <span key={index}>{<UserIcon style={iconStyle}/>}</span>
              } )}
            </Members>
          </Header>
          {showModal && (
            <EditCard
              cardId={editCardId}
              tasksData={data}
              listId={editListId}
              initialData={editData}
              toggleModal={this.toggleModal}
              saveTask={this.saveTask }
            />
          )}
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Container>
              {data.map(list => (
                <Droppable key={list.id} droppableId={list.id}>
                  {(provided, snapshot) => (
                    <div ref={provided.innerRef}>
                      <List
                        data={list}
                        addTask={this.addTask}
                        editTask={this.editTask}
                      />
                    </div>
                  )}
                </Droppable>
              ))}
            </Container>
          </DragDropContext>
        </Fragment>
      );
    } else {
      return null;
    }
  };
}
