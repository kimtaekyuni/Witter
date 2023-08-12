import { dbService, storageService } from "fBase";
import React, { useState } from "react";

const Weet = ({ weetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newWeet, setnewWeet] = useState(weetObj.text);

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this weet?");
    console.log(ok);
    if (ok) {
      await dbService.doc(`weets/${weetObj.id}`).delete();
      await storageService.refFromURL(weetObj.attachmentUrl).delete();
    }
  };
  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`weets/${weetObj.id}`).update({
      text: newWeet,
    });
    setEditing(false);
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setnewWeet(value);
  };

  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              value={newWeet}
              required
              type="text"
              placeholder="Edit your weet"
              onChange={onChange}
            />
            <input type="submit" value="Update Weet" />
          </form>
          <button onClick={toggleEditing}> Cancel</button>
        </>
      ) : (
        <>
          <h4>{weetObj.text}</h4>
          {weetObj.attachmentUrl && (
            <img src={weetObj.attachmentUrl} width="50px" height="50px" />
          )}
          {isOwner && (
            <>
              <button onClick={toggleEditing}>Edit Weet</button>
              <button onClick={onDeleteClick}>Delete Weet</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Weet;
