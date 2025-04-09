import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer>
      <p className="text-xs text-center w-full flex flex-row gap-2 justify-center items-center absolute bottom-0 p-5">
        Made with <Heart /> by{" "}
        <a
          className="underline"
          target="_blank"
          href="https://github.com/Thiago-Heleno"
        >
          Thiago-Heleno
        </a>
      </p>
    </footer>
  );
}
