import Link from 'next/link';
import { LoginForm } from './components/loginForm';
import S from './components/styles.module.scss';

export default function Home() {
  return (
    <main className={S.main}>
      <h1>Entrar</h1>
      <p className={S.registerMessage}>
        Não possui conta? <Link href="/registrar">Faça o cadastro</Link>
      </p>
      <LoginForm />
    </main>
  );
}
