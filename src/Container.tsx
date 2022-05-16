import type { FC } from 'react'

import { Card } from './Card'

const style = {
  width: 400,
  border: 'solid'
}

export interface Item {
  id: number
  text: string
}

export interface ContainerState {
  cards: Item[]
}

interface ContainerProps {
  list: any;
  panelNo: string;
  moveCard: (card: { id: string, text: string }, dragIndex: number, hoverIndex: number, sourcePanel: string, targetPanel: string) => void;
}

export const Container: FC<ContainerProps> = ({ list, panelNo, moveCard }) => {

  const renderCard =
    (card: { id: number; text: string }, index: number) => {
      return (
        <Card sourcePanel={panelNo}
          key={card.id}
          index={index}
          id={card.id}
          text={card.text}
          moveCard={moveCard}
          findCard={(id: number) => {
            return list.findIndex((x: any) => x.id === id)
          }}
        />
      )
    };

  return (
    <>
      <div style={style}>{list.map((card: any, i: any) => renderCard(card, i))}</div>
    </>
  )
}

