import { ChevronsLeft, KeyRound } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <h1 className="relative mt-10 text-3xl w-full text-center flex flex-row justify-center gap-5 items-center">
      <Link to="/" className="absolute left-5">
        <ChevronsLeft />
      </Link>
      <KeyRound className="h-8 w-8" /> RATE KEY
    </h1>
  );
}
