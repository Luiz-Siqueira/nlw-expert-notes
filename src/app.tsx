import { useState } from "react";
import Logo from "./assets/logo-nlw.svg";
import { NewNoteCard } from "./components/new-note-card";
import { NoteCard } from "./components/note-card";

interface Note {
  id: string;
  date: Date;
  content: string;
}
export function App() {
  const [search, setSearch] = useState<string>("");
  const [notes, setNotes] = useState<Note[]>(() => {
    const noteOnStorage = localStorage.getItem("notes");

    if (noteOnStorage) {
      return JSON.parse(noteOnStorage);
    }

    return [];
  });

  const filterNotes = (searchString: string) => {
    setSearch(searchString);
  };

  const filteredNotes =
    search !== ""
      ? notes.filter((note) =>
          note.content.toLowerCase().includes(search.toLowerCase())
        )
      : notes;

  const onNoteCreated = (content: string) => {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    };

    const notesArr = [newNote, ...notes];

    setNotes(notesArr);

    localStorage.setItem("notes", JSON.stringify(notesArr));
  };

  const onNoteDeleted = (id: string) => {
    const notesArray = notes.filter((note) => {
      return note.id !== id;
    });

    setNotes(notesArray);

    localStorage.setItem("notes", JSON.stringify(notesArray));
  };

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
      <img src={Logo} alt="NLW Expert" />

      <form className="w-full">
        <input
          className="w-full bg-transparent text-3xl font-semibold tracking-tigh outline-none placeholder:text-slate-500"
          type="text"
          placeholder="Busque em suas notas..."
          onChange={(event) => {
            filterNotes(event.target.value);
          }}
        />
      </form>

      <div className="h-px bg-slate-700"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[250px] gap-6">
        <NewNoteCard onNoteCreated={onNoteCreated} />
        {filteredNotes.map((note) => (
          <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted} />
        ))}
      </div>
    </div>
  );
}
