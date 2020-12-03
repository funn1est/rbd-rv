import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

import Column from './Column';
import styles from './Board.module.scss';

const columns = ['a', 'b', 'c', 'd'];

class Board extends React.Component {
  onDragEnd = () => {};

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <div className={styles['board-wrapper']}>
          {columns.map((k) => (
            <Column key={k} id={k} />
          ))}
        </div>
      </DragDropContext>
    );
  }
}

export default Board;
