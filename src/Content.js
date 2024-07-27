// import './index.css'
import ItemList from './ItemList'

// ({}) this is called prop drilling
const Content = ({ items, handleCheck, handleDelete }) => {

    return (
        <>
            {/*each react item in list needs a key attribute. This helpsreact which items have changed which have been added which items have been removed. Always list item needs a key items */}
            {/* ternary operator is used to check whether the items length. If it is empty is shows "Your List is Empty" or it displays the "List" */}
            {items.length ? (
                <ItemList
                    items={items}
                    handleCheck={handleCheck}
                    handleDelete={handleDelete}
                />
            ) : (
                <p style={{ marginTop: '2rem' }}>Your list is empty.</p>
            )}
        </>
    )
}

export default Content