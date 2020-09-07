
import React, { Component } from "react";
import styled from "styled-components";

const defaultInputStyle = `
display: block;
width: 100%;
margin-top: 18px;
height: 30px;
padding: 0 8px;
font-size: 13px;
background: #ffffff;
border: 1px solid #b1bbc4;
border-radius: 2px;
font-family: inherit;
outline: none;
`;

const Backlayer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(251, 253, 254, 0.7);
`;
const Container = styled.div`
  position: relative;
  width: 550px;
  height: 250px;
  padding: 20px;
  background-color: bisque;
  border: 1px solid #eff3f5;
  border-radius: 3px;
  box-shadow: 0 2px 10px 0 rgba(79, 100, 128, 0.06),
    0 6px 8px -6px rgba(79, 100, 128, 0.2);
`;

const Input = styled.input`
  ${defaultInputStyle};
  width: 100%;
`;

const Date = styled.input`
  ${defaultInputStyle};
  float: left;
  width: auto;
`;

const Select = styled.select`
  ${defaultInputStyle};
  float: right;
  width: 200px;
  -webkit-border-radius: 3px;
`;
const Option = styled.option``;

const ButtonGroup = styled.div`
position: absolute;
bottom: 0;
margin-top: 100px;
`;
const Button = styled.button`
  width: auto;
  height: 40px;
  margin-bottom: 5px;
  background: #b1bbc4;
  color: #ffffff;
  font-weight: 500;
  font-size: 15px;
  text-align: center;
  cursor: pointer;
  border-radius: 5px;

  ${props => {
    if (props.cancel) {
      return `
        margin-left: 15px;
        padding: 0 15px;
        background:#EEF3F5;
        color: #b1bbc4;
      `;
    }
  }};
`;

const DateSelectBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
`;

export default class EditCard extends Component {
  state = {
    id: "",
    taskData:"",
    date:"",
    status:"In List Started",
    assignee: "Assignee List"
  };
  previousStatus = null;

  componentWillMount = () => {
    const { initialData } = this.props;
    initialData && this.setState({ ...initialData });
  };

  componentWillUnmount() {
    this.previousStatus = null;
  }

  handleInputChange = (event) => {
    this.previousStatus = null;
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.previousStatus = this.state.status;
    this.setState({ [name]: value });
  };

  render() {
    const { taskData, date, status, assignee } = this.state;
    const { listId, toggleModal, saveTask, tasksData, cardId } = this.props;
    // console.log("this.props====>", this.props)
    return (
      <Backlayer>
        <Container>
            <Input
              type="text"
              name="taskData"
              value={taskData}
              onChange={this.handleInputChange}
            />
            <Date
              type="date"
              name="date"
              value={date}
              onChange={this.handleInputChange}
            />
            <DateSelectBox>
              <Select
                name="status"
                defaultValue={status}
                onChange={this.handleInputChange}
              >
                <Option value="In List Started" disabled hidden>In List Started</Option>
                <Option value="Planned" hidden={(cardId || tasksData[0].id===listId) ? false: true}>Planned</Option>
                <Option value="Started" hidden={(cardId || tasksData[1].id===listId) ? false: true}>Started</Option>
                <Option value="Done" hidden={(cardId || tasksData[2].id===listId) ? false: true}>Done</Option>
              </Select>

              <Select
                name="assignee"
                defaultValue={assignee}
                onChange={this.handleInputChange}
              >
                <Option value="Assignee List" disabled hidden>Assignee List</Option>
                <Option value="Jane">Jane</Option>
                <Option value="James">James</Option>
                <Option value="Jenny">Jenny</Option>
              </Select>
            </DateSelectBox>
          
          <ButtonGroup>
            <Button onClick={() => saveTask({task: this.state, previousStatus:this.previousStatus})}>
              Save
            </Button>
            <Button cancel onClick={toggleModal}>
              Close
            </Button>
          </ButtonGroup>
        </Container>
      </Backlayer>
    );
  };
}
