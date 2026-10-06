import { Header, Footer } from '@widgets/index';
import { Route, Routes } from 'react-router-dom';

import classes from './App.module.css';

const App = (): React.JSX.Element => {
  return (
    <div className={classes.app}>
      <Header />
      <main className={classes.main}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<div>О нас</div>} />
          <Route path="/all-questions" element={<div>Все вопросы + фильтры</div>} />
          <Route path="/game" element={<div>Игроровой режим</div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
