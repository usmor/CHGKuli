import { Header, Footer } from '@widgets/index';
import { Route, Routes } from 'react-router-dom';

import { About, AllQuestions, Home, NotFound, QuestionDetail } from '@/pages';

import classes from './App.module.css';

const App = (): React.JSX.Element => {
  return (
    <div className={classes.app}>
      <Header />
      <main className={classes.main}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/questions" element={<AllQuestions />} />
          <Route path="/questions/:id" element={<QuestionDetail />} />
          <Route path="/game" element={<div>Игроровой режим</div>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
