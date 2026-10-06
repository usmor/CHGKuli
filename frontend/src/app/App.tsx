import { Footer } from '@widgets/footer';
import { Header } from '@widgets/header';

import styles from './App.module.css';

const App = (): React.JSX.Element => {
  return (
    <div className={styles.app}>
      <Header />
      <Footer />
    </div>
  );
};

export default App;
