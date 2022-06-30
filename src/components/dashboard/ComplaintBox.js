import React from "react";
import "../../styles.css";
import { supabase } from "../../supabaseClient";
import { useState, useEffect } from "react";
import ReplyBox from "./ReplyBox";
import AvatarIcon from "../authentication/AvatarIcon";
import { CompressOutlined, ConstructionOutlined } from "@mui/icons-material";
import { getAccordionDetailsUtilityClass } from "@mui/material";
import {
  FaEye,
  FaEyeSlash,
  FaTrash,
  FaCheck,
  FaArrowUp,
  FaPlus,
  FaArrowDown,
  FaComment,
  FaClock,
} from "react-icons/fa";
import { TextField, Button } from "@mui/material";
import { ImCross } from "react-icons/im";
import ReactTimeAgo from "react-time-ago";

export default function ComplaintBox({
  session,
  id,
  subj,
  desc,
  upv,
  dov,
  timedate,
  anon,
  userID,
}) {
  const [like, setLike] = useState(upv);
  const [dislike, setDislike] = useState(dov);

  const [inReply, setReply] = useState(false);
  const [anonReply, setAnon] = useState(false);

  const [comment, setComment] = useState(
    "This is a comment text. I completely agree with this complaint but I think there are many problems"
  );

  const [del, setDelete] = useState(false);

  const [vote, setVote] = useState(0);
  const [mine, setMine] = useState(false);
  const [tempUp, setUp] = useState(null);
  const [tempDown, setDown] = useState(null);
  const [user, setUser] = useState(null);

  const [name, setName] = useState(null);
  const [title, setTitle] = useState(null);
  const [avatar_url, setAvatar] = useState(null);

  const [cells, setCell] = useState([]);

  const getData = async () => {
    const { data, error } = await supabase
      .from("REPLY")
      .select("*")
      .eq("comID", id)
      .order("id");

    setCell(data);
  };

  useEffect(() => {
    getData();
  }, []);

  const data = React.useMemo(() => cells, []);

  useEffect(() => {
    getProfile();
  });

  async function clickReply() {
    setReply(!inReply);
  }

  async function clickAnon() {
    setAnon(!anonReply);
  }

  async function Resolve() {}

  async function loadData() {
    try {
      const user = supabase.auth.user();

      setUser(user);

      let { data, error, status } = await supabase
        .from("VOTES")
        .select(`vote`, { count: "exact" })
        .eq("userID", user.id)
        .eq("comID", id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setVote(data.vote);
      }
    } catch (error) {
      console.error(error.message);
    } finally {
    }
  }

  async function getProfile() {
    try {
      setUser(supabase.auth.user());

      const user = supabase.auth.user();

      if (session && userID == user.id) {
        setMine(true);
      }

      if (session) {
        let { ins } = await supabase
          .from("VOTES")
          .upsert({ userID: user.id, comID: id }, { ignoreDuplicates: true });

        loadData();
      }

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, title, avatar_url`)
        .eq("id", userID)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        if (anon == true) {
          setName("Anonymous");
          setTitle("Anonymous User");
          setAvatar(null);
        } else {
          setName(data.username);
          setTitle(data.title);
          setAvatar(data.avatar_url);
        }
      }
    } catch (error) {
      console.error(error.message);
    } finally {
    }
  }

  async function submitReply(reply) {
    if (reply.length < 5) {
      alert("Replies must be over 5 characters.");
      return;
    }

    if (reply.length > 100) {
      alert("Replies must be under 100 characters.");
      return;
    }

    const { data, error } = await supabase
      .from("REPLY")
      .insert([
        { comID: id, userID: user.id, comment: reply, anon: anonReply },
      ]);

    clickReply();
    getData();
  }

  async function Delete() {
    const { data, error } = await supabase
      .from("COMPLAINT")
      .delete()
      .eq("id", id);

    setDelete(true);
  }

  async function Like() {
    if (vote == 0) {

      //change VOTE value to 1
      const { data, error } = await supabase
        .from("VOTES")
        .update({ vote: 1 })
        .eq("userID", user.id)
        .eq("comID", id);
      // change vote value to 1
      setVote(1);
      // increment COMPLAINT like value by 1
      const { data2, error2 } = await supabase
        .rpc('changelike', { x: 1, com_id: id })
      // increment like value by 1
      setLike(like + 1);


    } else if (vote == 1) {
      // set VOTE table value to 0
      const { data, error } = await supabase
        .from("VOTES")
        .update({ vote: 0 })
        .eq("userID", user.id)
        .eq("comID", id);
      // set vote value to 0
      setVote(0);
      // increment COMPLAINT like value by -1 !
      const { data2, error2 } = await supabase
        .rpc('changelike', { x: -1, com_id: id })
      // increment like value by -1
      setLike(like - 1);

    } else if (vote == -1) {
      //change VOTE value to 1
      const { data, error } = await supabase
        .from("VOTES")
        .update({ vote: 1 })
        .eq("userID", user.id)
        .eq("comID", id);
        console.log("test!!!")
      // change vote value to 1
      setVote(1);
      // increment COMPLAINT like value by 1
      const { data2, error2 } = await supabase
        .rpc('changelike', { x: 1, com_id: id })
      // increment like value by 1
      setLike(like + 1);
      // decrement COMPLAINT dislike value by 1
      const { data3, error3 } = await supabase
        .rpc('changedislike', { x: -1, com_id: id })
      // decrement dislike value by 1
      setDislike(dislike - 1);
    }

    
    
  }

  async function Dislike() {
    if (vote == 0) {

      //change VOTE value to -1
      const { data, error } = await supabase
        .from("VOTES")
        .update({ vote: -1 })
        .eq("userID", user.id)
        .eq("comID", id);
      // change vote value to -1
      setVote(-1);
      // increment COMPLAINT dislike value by 1
      const { data2, error2 } = await supabase
        .rpc('changedislike', { x: 1, com_id: id })
      // increment dislike value by 1
      setDislike(dislike + 1);


    } else if (vote == -1) {
      // set VOTE table value to 0
      const { data, error } = await supabase
        .from("VOTES")
        .update({ vote: 0 })
        .eq("userID", user.id)
        .eq("comID", id);
      // set vote value to 0
      setVote(0);
      // increment COMPLAINT dislike value by -1 !
      const { data2, error2 } = await supabase
        .rpc('changedislike', { x: -1, com_id: id })
      // increment dislike value by -1
      setDislike(dislike - 1);

    } else if (vote == 1) {
      //change VOTE value to -1
      const { data, error } = await supabase
        .from("VOTES")
        .update({ vote: -1 })
        .eq("userID", user.id)
        .eq("comID", id);
        console.log("test!!!")
      // change vote value to -1
      setVote(-1);
      // increment COMPLAINT dislike value by 1
      const { data2, error2 } = await supabase
        .rpc('changedislike', { x: 1, com_id: id })
      // increment dislike value by 1
      setDislike(dislike + 1);
      // decrement COMPLAINT like value by 1
      const { data3, error3 } = await supabase
        .rpc('changelike', { x: -1, com_id: id })
      // decrement like value by 1
      setLike(like - 1);
    }
  }
  

  // async function Resolve() {

  //   const { data, error } = await supabase
  //     .from('ComplaintDB')
  //     .update({ 'resolve': "true" })
  //     .eq('id', id)
  // }

  // if(resolve == "true") {
  //       return <div className="App">

  //       <div className="boxR">

  //       <div className="boxR-subject">

  //         <b></b> {subj}
  //       </div>

  //       <div className="boxR-description">
  //         <br></br>
  //         {desc}
  //         <br></br>
  //         <br></br>
  //         <hr></hr>
  //       </div>

  //         <br></br>
  //       <div className="grid-container">
  //         <div className="grid1">
  //           <div className="boxR-user">
  //             {(anon == "true" || !avatar_url) ? <i className='bx bx-user'> </i> : <AvatarIcon
  //             url={avatar_url}
  //             size={21}/>}
  //           <b>&nbsp;{userH}</b>

  //           </div>

  //           <div className="boxR-title">

  //           {titleH}
  //           </div>
  //           </div>

  //           <div className="grid2">
  //             <div className="boxR-right">
  //               <i className='bx bx-time'></i> &nbsp;{date} at {time.substring(0,5)}
  //               <br></br>

  //               <br></br>
  //               <i className='bx bx-like'></i>&nbsp;{likeH} &emsp;<i className='bx bx-dislike'></i>&nbsp;{dislikeH}

  //             </div>

  //           </div>
  //       </div>
  //     </div>
  //       <br></br>
  //   </div>;
  // }

  if (del) {
    return <div></div>;
  }

  return (
    <div className="App">
      <div className="box">
        <div className="box-subject">{subj}</div>

        <div className="box-description">
          <br></br>
          {desc}
          <br></br>
          <br></br>
          <hr></hr>
        </div>

        <br></br>
        <div className="grid-container">
          <div className="grid1">
            <div className="box-user">
              {anon == "true" || !avatar_url ? (
                <i className="bx bx-user"> </i>
              ) : (
                <AvatarIcon url={avatar_url} size={21} />
              )}
              <b>&nbsp;{name}</b>
            </div>

            <div className="box-title">{title}</div>
          </div>

          <div className="grid2">
            <div className="box-right">
              <FaClock />
              &nbsp;
              <ReactTimeAgo date={timedate} locale="en-US" />
              <br></br>
              <div className="likeDisplay">

                {(session) ? <button class="likeButton" onClick={() => Like()}>
                <FaArrowUp />
              </button> : <FaArrowUp />}
                &nbsp;{like} &emsp;

                {(session) ? <button class="disButton" onClick={() => Dislike()}>
                <FaArrowDown />
              </button> : <FaArrowDown />}
                &nbsp;{dislike}
              
              </div>
            </div>
          </div>
        </div>

        <div>
          &nbsp;&nbsp;
          {session ? (
            <div>
              
              &nbsp;&nbsp;
              
              &nbsp;&nbsp;
              {mine ? (
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to resolve this complaint?"
                      )
                    )
                      Resolve();
                  }}
                >
                  &emsp;
                  <FaCheck />
                  &emsp;
                </button>
              ) : (
                ""
              )}
              &nbsp;&nbsp;
              <button onClick={() => clickReply()}>
                &emsp;
                <FaComment />
                &emsp;
              </button>
              &nbsp;&nbsp;
              {mine ? (
                <button
                  class="redButton"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this complaint?"
                      )
                    )
                      Delete();
                  }}
                >
                  &emsp;
                  <FaTrash />
                  &emsp;
                </button>
              ) : (
                ""
              )}
              
            </div>
          ) : (
            <></>
          )}
          <br></br>
          {inReply ? (
            <div className="grid-container2">
              <div className="input-reply">
                <TextField
                  fullWidth
                  sx={{
                    input: {
                      color: "black",
                      background: "white",
                      borderRadius: 2,
                      fontWeight: "fontWeightLight",
                      fontSize: 13,
                    },
                  }}
                  variant="filled"
                  size="small"
                  label="Comment"
                  id="reply"
                />
              </div>

              <div className="box-right3">
                <button onClick={() => clickAnon()}>
                  {!anonReply ? <FaEye /> : <FaEyeSlash />}
                </button>
                &nbsp;
                <button
                  class="greenButton"
                  onClick={() =>
                    submitReply(document.getElementById("reply").value)
                  }
                >
                  <FaPlus />
                </button>
                &nbsp;
                <button class="redButton" onClick={() => clickReply()}>
                  <ImCross />
                </button>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>

        {cells.map((item, index) => (
          <ReplyBox
            key={index}
            owner={userID}
            ownerAnon={anon}
            comment={item.comment}
            anon={item.anon}
            userID={item.userID}
            timedate={item.timedate}
          />
        ))}
      </div>
      <br></br>
    </div>
  );
}
