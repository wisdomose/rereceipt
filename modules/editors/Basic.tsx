import { POS, RECEIPT } from "../../types";
import { genEditorStyle, omit } from "../../utils";
import {ReactElement} from "react"

export default function Basic({
  structure,
  children,
}: {
  structure: RECEIPT & POS;
  children: ReactElement[];
}) {
  return (
    <section className="w-full">
      <div
        style={genEditorStyle(
          omit({ ...structure.settings }, ["width", "font_size"])
        )}
        className={`text-black mx-auto lg:max-w-4xl grid md:grid-cols-2 gap-12 my-0 px-6 md:px-14 lg:px-6 py-12`}
      >
        {children}
      </div>
    </section>
  );
}
