import { FaHeart } from 'react-icons/fa';

export const Footer = () => {
  return (
    <footer className="text-center text-xs py-5 text-contai-lightBlue">
      Feito com <FaHeart className="inline text-red-500" /> por
      <br />
      <a href="https://freddonega.dev/" target="_blank" className="underline">
        Fred Donega
      </a>{' '}
      e{' '}
      <a
        href="https://www.linkedin.com/in/gabriela-t-010258195/"
        target="_blank"
        className="underline"
      >
        Gabriela Tavares
      </a>
    </footer>
  );
};
