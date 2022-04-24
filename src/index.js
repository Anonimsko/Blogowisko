import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import {db} from "./firebase-config";

const App = () => 
{
  const MainPage = () =>
  {
    return(
      <div className="mainPage">
        <h1>Blogowisko</h1>
        <h3>Twórz niepowtarzalnego bloga. Opisuj pasje, zajawki, cokolwiek chcesz na swój sposób.
Wystarczy duży zapał, pomysł na treść i dzięki łatwości korzystania z funkcji Blogowiska jesteś w stanie w niecałe 10 minut wypuścić wspaniały blog. Spróbuj już dziś, to takie proste!</h3>
      </div>
    )
  }

  const [page, setPage] = useState(<MainPage />);
  const [loginButton, setLoginButton] = useState("Logowanie");
  const [addBlogButton, setAddBlogButton] = useState("Dodaj własny blog");
  const [logged, setLogged] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const blogsCollectionRef = collection(db, "blogs");

  const getBlogs = async () => 
  {
    const data = await getDocs(blogsCollectionRef);
    setBlogs(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
  }

  useEffect(() =>
  {
    getBlogs();
  }, []);

  function addBlogsButton()
  {
    if(logged == true)
      setPage(<ManageBlogs />)
    else
      setPage(<Login/>);
  }

  function login()
  {
    if(logged == false)
      setPage(<Login/>);
    else
    {
      setLogged(false);
      setLoginButton("Logowanie");
      setAddBlogButton("Dodaj własny blog");
    }
  }

  const Login = () =>
  {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [isCorrect, setIsCorrect] = useState("");

    return(
      <div className="login">
        <h1>Zaloguj się</h1>
        <input type="text" placeholder="Login"/><br />
        <input type="password" placeholder="Hasło"/><br />
        <button>Zaloguj</button><br />
      </div>
    )
  }

  const ManageBlogs = () =>
  {
    const [manageOptions, setManageOptions] = useState("");

    const AddBlog = () =>
    {
      const [name, setName] = useState("");
      const [headline, setHeadline] = useState("");
      const [text, setText] = useState("");
      const [isEmpty, setIsEmpty] = useState("");

      return(
        <div className="addBlog">
          <input type="text" placeholder="Nazwa"/><br />
          <input type="text" placeholder="Nagłówek"/><br />
          <textarea placeholder="Tekst"/><br />
          <button>Dodaj</button><br />
        </div>
      )
    }

    const DeleteBlog = () =>
    {
      return(
        <div className="deleteBlogs">
          {blogs.map((blog, idx) => 
          {
            return(
              <div key={idx}>
                <h3>{blog.name}</h3><button>Usuń</button><br />
              </div>
            )
          })}
        </div>
      )
    }

    return(
      <div className="manageBlogs">
        <button className="addBlogButton2" onClick={() => { setManageOptions(<AddBlog />) }}>Dodaj blog</button>
        <button className="deleteBlogButton" onClick={() => { setManageOptions(<DeleteBlog />); }}>Usuń blog</button>
        {manageOptions}
      </div>
    )

  }

  

  const Blog = ({pageIdx}) =>
  {
    return(
      <div className="blog">
        <h1>{blogs[pageIdx].headline}</h1>
        <p>{blogs[pageIdx].date}</p>
        <h3>{blogs[pageIdx].text}</h3>
      </div>
    )
  }

  const CurrentPage = () => 
  {
    return(
      <div className="currentPage">
        <div className="header">
          <h1 onClick={() => { setPage(<MainPage />) }}>Blogowisko</h1>
          <button className="addBlogButton" onClick={addBlogsButton}>{addBlogButton}</button>
          <button className="loginButton" onClick={login}>{loginButton}</button>
        </div>
        <div className="blogs">
          {blogs.map((blog, idx) => 
          {
            return(
              <h3 key={idx} onClick={() => { setPage(<Blog pageIdx={idx}/>) }}>{blog.name}</h3>
            )
          })}
        </div>
        <div className="page">
          {page}
        </div>
      </div>
    )
  }

  return(
    <CurrentPage />
  )
}

ReactDOM.render(
  <App />,
  document.getElementById("root")
);
