import { VscDebugDisconnect } from "react-icons/vsc";
// import Brand from "../../components/ui/Brand/Brand";
import { IoReload } from "react-icons/io5";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
// import { PATH_CONSTANTS } from "../../routes/pathConstants";
// import { BiSupport } from "react-icons/bi";
// import Button from "@components/ui/Button/Button";
// import Link from "@components/ui/Button/Link";
import { BiSupport } from "react-icons/bi";
import { LucideTextCursorInput } from "lucide-react";
import { BRAND } from "@/lib/constants";

const GenericError = () => {
  return (
    <div className="w-dvw h-dvh p-5">
      <div className="w-full h-full max-h-[5%]  flex justify-center place-items-center gap-2">
        <Button size={"icon"} className="size-10 rounded-b-sm">
          <LucideTextCursorInput className="size-6" />
        </Button>
        <span className="text-lg leading-4 font-medium text-foreground">
          {BRAND.name}
        </span>
      </div>
      <div className="w-full h-full max-h-[95%] flex justify-center place-items-center">
        <div className="flex flex-col place-items-center gap-3">
          {/* ooops ! */}
          {/* todo - update the colors */}
          <div className="w-full h-full text-center flex justify-center place-items-center gap-2">
            <VscDebugDisconnect className="p-1 rounded text-5xl bg-amber-400" />
            <span className="font-bold text-6xl ">Oooops!</span>
          </div>

          {/* message and take me home */}
          <div className="flex flex-col place-items-center gap-1">
            {/* <div>We're sorry, something went wrong :(</div> */}
            <p>Brace yourself till we get the error fixed.</p>
            <p>You may also refresh the page or try again later</p>
          </div>
          <div className="flex justify-center place-items-center my-4 gap-10">
            <Button onClick={() => window.location.reload()}>
              <IoReload strokeWidth={1} size={21} />
              Reload the page
            </Button>
            <Button variant="ghost">
              <BiSupport size={21} />
              <Link to={"/help-center"} target="_blank">
                visit our help center
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenericError;
