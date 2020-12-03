import React from 'react';
import ReactDOM from 'react-dom';
import { List, AutoSizer, Index, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import {
  Draggable,
  DraggableProvided,
  DraggableRubric,
  DraggableStateSnapshot,
  Droppable,
} from 'react-beautiful-dnd';

import styles from './Column.module.scss';
import { ListRowProps } from 'react-virtualized/dist/es/List';

interface Props {
  id: string;
}

interface State {
  size: number;
  heights: number[];
}

const genHeights = (size = 100) => {
  return Array.from({ length: size }).map(() => 25 + Math.round(Math.random() * 50));
};

const genSize = () => {
  return 20 + Math.round(Math.random() * 42);
};

const SPAN_SIZE = 8;

class Column extends React.Component<Props, State> {
  private cache = new CellMeasurerCache({
    fixedWidth: true,
    minHeight: 24,
  });
  constructor(props: Props) {
    super(props);
    const size = genSize();
    this.state = {
      size,
      heights: genHeights(size),
    };
  }

  getRowHeight = ({ index }: Index) => {
    const { size } = this.state;
    // return ROW_HEIGHT + (index === size - 1 ? 0 : SPAN_SIZE);
    return index === size - 1 ? 0 : SPAN_SIZE;
  };

  renderClone = (
    provided: DraggableProvided,
    snapshot: DraggableStateSnapshot,
    rubric: DraggableRubric,
  ) => {
    const { heights } = this.state;
    const {
      source: { index },
    } = rubric;

    const height = heights[index];

    return (
      <div
        className={styles['card']}
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        style={{
          ...provided.draggableProps.style,
          height,
        }}
      >
        {height}
      </div>
    );
  };

  renderRow = ({ key, index, style, parent }: ListRowProps) => {
    const { id } = this.props;
    const { heights } = this.state;

    const span = this.getRowHeight({ index });

    // return <CellMeasurer
    //   cache={this._cache}
    //   columnIndex={0}
    //   key={key}
    //   rowIndex={index}
    //   parent={parent}>
    //   {({measure, registerChild}) => (
    //     <div ref={registerChild} className={classNames} style={style}>
    //       <img
    //         onLoad={measure}
    //         src={source}
    //         style={{
    //           width: imageWidth,
    //         }}
    //       />
    //     </div>
    //   )}
    // </CellMeasurer>

    const height = heights[index];

    return (
      <CellMeasurer cache={this.cache} columnIndex={0} key={key} rowIndex={index} parent={parent}>
        {({ registerChild }) => {
          return (
            <div key={key} style={style} className={styles['card-wrapper']}>
              <Draggable draggableId={`${id}-${index}`} index={index} key={index}>
                {(provided) => {
                  return (
                    <div
                      className={styles['card']}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{ ...provided.draggableProps.style, height }}
                    >
                      <div
                        className={styles['card-content']}
                        style={{ height }}
                        // @ts-ignore
                        ref={registerChild}
                      >
                        <div
                          className={styles['card-styles']}
                          style={{ height, marginBottom: span }}
                        >
                          {height}
                        </div>
                      </div>
                    </div>
                  );
                }}
              </Draggable>
            </div>
          );
        }}
      </CellMeasurer>
    );

    // return (
    //   <div key={key} style={style} className={styles['card-wrapper']}>
    //     <Draggable draggableId={`${id}-${index}`} index={index} key={index}>
    //       {(provided, snapshot) => {
    //         return (
    //           <div
    //             className={styles['card']}
    //             ref={provided.innerRef}
    //             {...provided.draggableProps}
    //             {...provided.dragHandleProps}
    //             style={{ ...provided.draggableProps.style, height: ROW_HEIGHT }}
    //           >
    //             {heights[index]}
    //           </div>
    //         );
    //       }}
    //     </Draggable>
    //   </div>
    // );
  };

  render() {
    const { id } = this.props;
    const { size, heights } = this.state;

    return (
      <div className={styles['column-wrapper']}>
        <div className={styles['column-title']}>{id}</div>
        <Droppable droppableId={id} mode="virtual" renderClone={this.renderClone}>
          {(droppableProvided, snapshot) => {
            return (
              <div className={styles['scroll-wrapper']}>
                <AutoSizer>
                  {({ height, width }) => (
                    <List
                      className={styles['scroll-list']}
                      ref={(ref) => {
                        // react-virtualized has no way to get the list's ref that I can so
                        // So we use the `ReactDOM.findDOMNode(ref)` escape hatch to get the ref
                        if (ref) {
                          // eslint-disable-next-line react/no-find-dom-node
                          const whatHasMyLifeComeTo = ReactDOM.findDOMNode(ref);
                          if (whatHasMyLifeComeTo instanceof HTMLElement) {
                            droppableProvided.innerRef(whatHasMyLifeComeTo);
                          }
                        }
                      }}
                      height={height}
                      width={width}
                      rowCount={size}
                      rowRenderer={this.renderRow}
                      deferredMeasurementCache={this.cache}
                      rowHeight={this.cache.rowHeight}
                    />
                  )}
                </AutoSizer>
              </div>
            );
          }}
        </Droppable>
      </div>
    );
  }
}

export default Column;
