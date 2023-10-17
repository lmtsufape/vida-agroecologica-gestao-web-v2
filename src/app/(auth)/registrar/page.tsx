import RegisterForm from './components/registerForm';
import S from './components/styles.module.scss';

export default function Home() {
  return (
    <main className={S.mainForm}>
      <RegisterForm />
    </main>
  );
}
