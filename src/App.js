import Header from './Header'
import SearchItem from './SearchItem'
import AddItem from './AddItem'
import Content from './Content'
import Footer from './Footer'
import { useState, useEffect } from 'react'
import apiRequest from './apiRequest'

function App() {
  
  // const [items, setItems] = useState([
  //   {
  //       id: 1,
  //       checked: true,
  //       item: "One half pound bag of Coca Covered"
  //   },
  //   {
  //       id: 2,
  //       checked: false,
  //       item: "Item 2"
  //   },
  //   {
  //       id: 3,
  //       checked: false,
  //       item: "Item 3"
  //   }
  
  // ])


  // below code is set because the added items are stored in localStorage while refreshing so that the objects are not removed

  // this will add new list 
  const [newItem, setNewItem] = useState('')

  const [items, setItems] = useState([])

  // const [items, setItems] = useState(JSON.parse(localStorage.getItem('shoppinglist'))??[])
  
  const [search, setSearch] = useState('')
  
  const [fetchError, setFetchError] = useState(null)
  
  const [isLoading, setIsLoading] = useState(true)

  // fetch api
  const API_URL = 'http://localhost:3500/items'


  //everytime when we enter something the page gets rendered again and again and again. To stop load time we use empty array in useEffect end
  //useEffect is async
  useEffect(() => {
    // fetchItems is Read Operation
    const fetchItems = async () => {
      try {
        const response = await fetch(API_URL)
        if (!response.ok) throw Error('Did not receive expected data')
        const listItems = await response.json()
        setItems(listItems)
        setFetchError(null)
      } catch (err) {
        setFetchError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    // below is not required
    // (async () => await fetchItems())() but we use fetchItem()
    setTimeout(() => fetchItems(), 2000)
  }, [])



  // const setAndSaveItems = (newItems) => {
  //   setItems(newItems)
  //   localStorage.setItem('shoppinglist', JSON.stringify(newItems))
  // }



// async is added in addItem because apiRequest file is used in async method
const addItem = async (item) => {
  const id = items.length ? items[items.length - 1].id + 1 : 1
  const myNewItem = { id, checked: false, item }
  const listItems = [...items, myNewItem]
  // setAndSaveItems(listItems)
  setItems(listItems)

  const postOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(myNewItem)
  }
  const result = await apiRequest(API_URL, postOptions)
  if (result) setFetchError(result)
}



const handleCheck = async (id) => {
  // below like of code is to convert a tick to untick when handleCheck is invoked or viceversa.
    // here the above prop 'id' checked whether the invoked id is same or not. If it is same. The '!item.checked' converts to opposite of its value. 

    // If true, it creates a new object with the spread (...) operator, copying all properties of the current item, but toggling the checked property to its opposite value using 
    const listItems = items.map((item) => item.id === id ? { ...item, checked: !item.checked } : item)
    // setAndSaveItems(listItems)
    setItems(listItems)

    // Update Operation - PATCH
    const myItem = listItems.filter((item) => item.id === id);
    const updateOptions = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ checked: myItem[0].checked })
    };
    const reqUrl = `${API_URL}/${id}`;
    const result = await apiRequest(reqUrl, updateOptions);
    if (result) setFetchError(result);
  }

  // delete operation
  const handleDelete = async (id) => {
    const listItems = items.filter((item) => item.id !== id);
    // setAndSaveItems(listItems);
    setItems(listItems)

    const deleteOptions = { method: 'DELETE' };
    const reqUrl = `${API_URL}/${id}`;
    const result = await apiRequest(reqUrl, deleteOptions);
    if (result) setFetchError(result);
  }

  const handleSubmit = (e) => {
    // below line does not allow page reload while submitting
    e.preventDefault()
    if(!newItem) return
    // console.log(newItem)
    addItem(newItem)
    //addItem 
    setNewItem('')
  }


  return (
    <div className="App">
      <Header title="Grocery List" />
      <AddItem
        newItem={newItem}
        setNewItem={setNewItem}
        handleSubmit={handleSubmit}
      />
      <SearchItem
        search={search}
        setSearch={setSearch}
      />
      <main>
        {isLoading && <p>Loading Items...</p>}
        {fetchError && <p style={{ color: "red" }}>{`Error: ${fetchError}`}</p>}
        {!fetchError && !isLoading && 
        <Content
          items={items.filter(item => ((item.item).toLowerCase()).includes(search.toLowerCase()))}
          handleCheck={handleCheck}
          handleDelete={handleDelete}
        />}
         {/* } */}
      </main>
      <Footer length={items.length} />
    </div>
  );
}

export default App;

