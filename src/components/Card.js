import React, { Component } from "react";
import styled from "styled-components";
import { UserIcon } from "./Icons";

const Container = styled.div`
  
  padding: 20px;
  border-bottom: 1px solid #eef3f5;

  ${props => {
    if (props.isDragging) {
      return `
        box-shadow: 0 2px 10px 0 rgba(79, 100, 128, 0.06),
        0 6px 8px -6px rgba(79, 100, 128, 0.2);
      `;
    }
  }};
`;

const Date = styled.div`
  margin-top: 5px;
  color: #879aaa;
`;

const Name = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #879aaa;
  margin-bottom: 8px;
`;

const Assignee = styled.div`
  float: right;
  color: #879aaa;
`;



export default class Card extends Component {
  render = () => {
    const { data, isDragging, editTask, listId } = this.props;
    const { id, date, taskData, status, assignee } = data;

    return (
      <Container isDragging={isDragging} onDoubleClick={(e) => {e.stopPropagation();editTask(listId, id, data)}}>
            <Name>{taskData}</Name>
            <Date>Due: {date}</Date>
            <Assignee>{assignee} <UserIcon /></Assignee>  
      </Container>
    );
  };
}
