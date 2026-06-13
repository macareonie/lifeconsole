import { FaDiscord, FaInstagram, FaLinkedin, FaTelegram } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const Footer = () => {
  return (
    <>
      <footer className="fixed bottom-0 left-0 right-0 p-4 border-t bg-background/80 backdrop-blur">
        <div className="flex justify-center space-x-4">
          <a
            href="https://discordapp.com/users/299909491120537600/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaDiscord className="h-6 w-6 text-blue-500 hover:text-blue-600" />
          </a>
          <a
            href="https://t.me/macaReonie"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTelegram className="h-6 w-6 text-blue-400 hover:text-blue-500" />
          </a>
          <a
            href="https://www.instagram.com/reon.chiang/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram className="h-6 w-6 text-pink-500 hover:text-pink-600" />
          </a>
          <a
            href="https://www.linkedin.com/in/ryancry/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin className="h-6 w-6 text-blue-400 hover:text-blue-500" />
          </a>
          <a
            href="mailto:e0958490@u.nus.edu"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MdEmail className="h-6 w-6 text-blue-500 hover:text-blue-600" />
          </a>
        </div>
      </footer>
    </>
  );
};

export default Footer;
