import React, { useEffect, useState } from 'react';
import Tmdb from './Tmdb';
import MovieRow from './componentes/MovieRow'
import AppCSS from './App.css'
import FeaturedMovie from './componentes/FeaturedMovie'
import Header from './componentes/Header'


export default () => {

  const [movieList, setMovieList] = useState([])
  const [featuredData, setFeaturedData] = useState(null)
  const [blackHeader, setBlackHeader] = useState(false)

  useEffect(() => {
    const loadAll = async () => {
      // Pegando a lista dos filmes
      let list = await Tmdb.getHomeList()
      setMovieList(list)

      // Pegando o Featured (filme em destaque)
      let originals = list.filter(i=>i.slug === 'originals')
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length -1))
      let chosen = originals[0].items.results[randomChosen]
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv')
      setFeaturedData(chosenInfo)
    }
    loadAll()
  }, [])

  useEffect(()=>{
    const scrollListener = () => {
      if(window.scrollY > 10) {
        setBlackHeader(true)
      } else {
        setBlackHeader(false)
      }
    }
    window.addEventListener('scroll', scrollListener)

    return () => {
      window.removeEventListener('scroll', scrollListener)
    }
  },[])

  return (
    <div className="page">
      <Header black={blackHeader} />

      {featuredData &&
       <FeaturedMovie item={featuredData}/>
      }

      <section className="lists">
        {movieList.map((item, key) => (
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>

      <footer>
        Todo o crédito deste projeto ao professor Bonieky Lacerda <span role="img" aria-label="coração">💙</span><br/>
        Direitos de imagem para Netflix<br/>
        API utilizada do site Themoviedb.org
      </footer>

      {movieList.length <= 0 && 
      <div className="loading">
        <img src="https://c.tenor.com/Rfyx9OkRI38AAAAC/netflix-netflix-startup.gif" alt="Carregando"/>
      </div>
      }
    </div>
  )
}