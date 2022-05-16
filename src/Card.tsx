import type { Identifier, XYCoord } from 'dnd-core'
import type { FC } from 'react'
import { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'

import { ItemTypes } from './ItemTypes'

const style = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
}

export interface CardProps {
  id: any
  sourcePanel: string
  text: string
  index: number
  moveCard: (card: { id: string, text: string }, dragIndex: number, hoverIndex: number, sourcePanel: string, targetPanel: string) => void
  findCard: (id: number) => number
}

interface DragItem {
  index: number
  id: string
  text: string
  type: string
  sourcePanel: string
  targetPanel: string
}

export const Card: FC<CardProps> = ({ id, text, index, moveCard, sourcePanel, findCard }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [{ handlerId, isItemDragging, isOver }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null, isItemDragging: boolean, isOver: boolean }
  >({
    accept: ItemTypes.CARD,
    collect: (monitor) => ({
      handlerId: monitor.getHandlerId(),
      isItemDragging: monitor.getItem() !== null,
      isOver: !!monitor.isOver(),
    }),
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      const targetPanel = sourcePanel

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action
      // if (isOver) {
      console.log(item);
      moveCard({ id: item.id, text: item.text }, dragIndex, hoverIndex, item.sourcePanel, targetPanel)
      // }

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })

  const originalIndex = findCard(id);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id, index, sourcePanel, text }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const { id, index, sourcePanel, text } = item
      const didDrop = monitor.didDrop()
      if (!didDrop) {
        // fix
        debugger;
        moveCard({ id: id, text: text }, originalIndex, -1, sourcePanel, '')
      }
    },
  })

  const opacity = isDragging ? 0 : 1
  drag(drop(ref))
  return (
    <div ref={ref} style={{ ...style, opacity }} data-handler-id={handlerId}>
      {text} index {index}
    </div>
  )
}
