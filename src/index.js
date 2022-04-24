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
    function checkLoginData()
    {
      let correctLogin = 1234;
      let correctPassword = 1234;
      if(login == correctLogin && password == correctPassword)
      {
        setLoginButton("Wyloguj");
        setLogged(true);
        setAddBlogButton(<button onClick={() => {  }}>Zarządzaj blogami</button>);
        setIsCorrect("");
        setAddBlogButton("Zarządaj blogami")
        setPage(<MainPage />)
      }
      else if(login != correctLogin || password != correctPassword)
        setIsCorrect(<p>Dane logowania są nieprawidłowe!</p>);
    }

    return(
      <div className="login">
        <h1>Zaloguj się</h1>
        <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} placeholder="Login"/><br />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Hasło"/><br />
        <button onClick={checkLoginData}>Zaloguj</button><br />
        {isCorrect}
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
      let date = new Date().toLocaleDateString("pl-PL", {year: "numeric", month: "2-digit", day: "2-digit"});

      const createBlog = async () =>
      {
        if(name == "" || headline == "" || text == "")
          setIsEmpty("Żadne pole nie może być puste!");
        else
        {
          setIsEmpty("");
          await addDoc(blogsCollectionRef, {name: name, headline: headline, text: text, date: date});
          getBlogs();
          setPage(<MainPage />);
        }
      }

      return(
        <div className="addBlog">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nazwa"/><br />
          <input type="text" value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="Nagłówek"/><br />
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Tekst"/><br />
          <button onClick={createBlog}>Dodaj</button><br />
          <p>{isEmpty}</p>
        </div>
      )
    }

    const DeleteBlog = () =>
    {
      const deleteBlog = async (id) =>
      {
        const blogDoc = doc(db, "blogs", id);
        await deleteDoc(blogDoc);
        getBlogs();
        setPage(<MainPage />);
      }

      return(
        <div className="deleteBlogs">
          {blogs.map((blog, idx) => 
          {
            return(
              <div key={idx}>
                <h3>{blog.name}</h3><button onClick={() => { deleteBlog(blog.id) }}>Usuń</button><br />
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
