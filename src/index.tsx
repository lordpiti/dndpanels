
import { render } from 'react-dom'
import { useState } from 'react'
import Example from './example'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

function App() {

	const generateList = (amount: number, start: number) => {
		const list = [...Array(amount).keys()];

		return list.map(x => ({
			id: start + x, text: `item ${start + x}`, index: x
		}));
	}

	const lista = {
		item1: generateList(10, 0),
		item2: generateList(10, 10)
	} as any;
	const [elestao, setestao] = useState(lista);

	const moveCard = (card: { id: string, text: string }, dragIndex: number, hoverIndex: number, sourcePanel: string, targetPanel: string) => {
		if (hoverIndex === -1) {
			//TODO: loop over the dictionary to find the panel and the index, atm only working for first panel
			let in1 = elestao[sourcePanel].findIndex((x: any) => x.id === card.id);

			elestao[sourcePanel].splice(in1, 1);
			elestao[sourcePanel].splice(dragIndex, 0, { id: card.id, text: card.text });

			setestao({ ...elestao });
		}
		else {

			//TODO: loop over the dictionary to find the panel and the index
			const elindex = elestao[sourcePanel].findIndex((x: any) => x.id === card.id);

			if (elindex > -1) {
				console.log(`move ${card.text} from ${sourcePanel}-${elindex} to ${targetPanel}-${hoverIndex}`)
				elestao[sourcePanel].splice(elindex, 1);
				setestao({ ...elestao });
			}
			else {
				const elindex2 = elestao[targetPanel].findIndex((x: any) => x.id === card.id);
				console.log(`move ${card.text} from ${targetPanel}-${elindex2} to ${targetPanel}-${hoverIndex}`)
				elestao[targetPanel].splice(elindex2, 1);
				setestao({ ...elestao });
			}

			if (hoverIndex > -1) {
				elestao[targetPanel].splice(hoverIndex, 0, { id: card.id, text: card.text });
				setestao({ ...elestao });
			}
		}

	}

	return (
		<div className="App">
			<DndProvider backend={HTML5Backend}>
				{elestao.item1.length}
				{elestao.item2.length}
				<Example list={elestao.item1} panelNo={'item1'} moveCard={moveCard} />
				<Example list={elestao.item2} panelNo={'item2'} moveCard={moveCard} />
			</DndProvider>
		</div>
	)
}

const rootElement = document.getElementById('root')
render(<App />, rootElement)
