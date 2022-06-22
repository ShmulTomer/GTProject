import React from "react";
import '../../styles.css'
import { supabase } from "../../supabaseClient";
import { useState, useEffect } from "react";
import AvatarIcon from "../authentication/AvatarIcon";

export default function ComplaintBox({ session, id, subj, desc, upv, dov, time, date, anon, userID }) {

  const [like, setLike] = useState(upv);
  const [dislike, setDislike] = useState(dov);
  

  const [vote, setVote] = useState(0);
  const [mine, setMine] = useState(false);
  const [tempUp, setUp] = useState(null);
  const [tempDown, setDown] = useState(null);
  const [user, setUser] = useState(null);
  
  const [name, setName] = useState(null);
  const [title, setTitle] = useState(null);
  const [avatar_url, setAvatar] = useState(null);

  useEffect(() => {
    getProfile()
  }, )


  console.log("Hello")
  
  async function getProfile() {
    try {
      //setUser(supabase.auth.user())

      
      const user = supabase.auth.user()

      if (session && userID == user.id) {
        setMine(true);
      }
      

      // if(session) {
      //   // const { data, error } = await supabase
      //   //   .from('VOTES')
      //   //   .upsert({userID: user.id, comID: id, vote: 0}, { onConflict: 'id' })
      //   //   .eq('userID', user.id)
      //   //   .eq('comID', id)
          
      //     // if(data) {
      //     //   setVote(data.vote);

      //     // } else {

      //     //   // const {data2, error} = await supabase
      //     //   // .from('VOTES')
      //     //   // .insert([
      //     //   // { userID: user.id, comID: id, vote: 0},])
      //     // }

      // }



      let { data, error, status } = await supabase
        .from('profiles')
        .select(`username, title, avatar_url`)
        .eq('id', userID)
        .single()

      if (error && status !== 406) {
         throw error
      }

      if (data) {
        if(anon == true) {
          setName("Anonymous")
          setTitle("Anonymous User")
          setAvatar(null)
        } else {
          setName(data.username);
          setTitle(data.title);
          setAvatar(data.avatar_url);
        }
        
  
      }
    } catch (error) {
      alert(error.message)
    } finally {
      
    }
  }

  async function Like() {

        if (vote == 1) {
          return;
        }
 
        const { data, error } = await supabase
          .from('VOTES')
          .update({vote: 1})
          .eq('userID', user.id)
          .eq('comID', id);
        

          const { data2, error2 } = await supabase
          .from('COMPLAINT')
          .select(`upv`)
          .eq('id', id)
          .single();
        
          if(data2) {
            setUp(data2.upv + 1);

            const { data3, error3 } = await supabase
              .from('COMPLAINT')
              .update({upv: tempUp})
              .eq('id', id)

            
              setLike(tempUp);
            
          }


          
          
      if (vote == -1) {
        
        const { data2, error2 } = await supabase
        .from('VOTES')
        .select(`dov`)
        .eq('userID', user.id)
        .eq('comID', id)
        .single();
      
        if(data2) {
          setDown(data2.dov - 1);
        }

        const { data3, error3 } = await supabase
        .from('VOTES')
        .update({dov: tempDown})
        .eq('userID', user.id)
        .eq('comID', id)

        if (data3) {
          setDislike(tempDown);
        }
      }

      setVote(1);


    }

    async function Dislike() {

      if (vote == -1) {
        return;
      }

      const { data, error } = await supabase
        .from('VOTES')
        .update({vote: -1})
        .eq('userID', user.id)
        .eq('comID', id);
      


        const { data2, error2 } = await supabase
        .from('VOTES')
        .select(`dov`)
        .eq('userID', user.id)
        .eq('comID', id)
        .single();
      
        if(data2) {
          setDown(data2.dov + 1);
        }

        const { data3, error3 } = await supabase
        .from('VOTES')
        .update({dov: tempDown})
        .eq('userID', user.id)
        .eq('comID', id)

        if (data3) {
          setDislike(tempDown);
        }
        
    if (vote == 1) {
      
      const { data2, error2 } = await supabase
      .from('VOTES')
      .select(`upv`)
      .eq('userID', user.id)
      .eq('comID', id)
      .single();
    
      if(data2) {
        setUp(data2.upv - 1);
      }

      const { data3, error3 } = await supabase
      .from('VOTES')
      .update({upv: tempUp})
      .eq('userID', user.id)
      .eq('comID', id)

      if (data3) {
        setLike(tempUp);
      }
    }

    setVote(-1);


  }
//
// .from('profiles')
//         .select(`username, title, email, avatar_url`)
//         .eq('id', user.id)
//         .single()


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

    

    return <div className="App">

            <div className="box">
              
            <div className="box-subject">
              
              {subj}
            </div>

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
                  {(anon == "true" || !avatar_url) ? <i className='bx bx-user'> </i> : <AvatarIcon
                  url={avatar_url}
                  size={21}/>}
                <b>&nbsp;{name}</b> 

                </div>

                <div className="box-title">
                
                
                {title}
                </div>
                </div>

                <div className="grid2"> 
                  <div className="box-right">
                    <i className='bx bx-time'></i> &nbsp;{date} at {time.substring(0,5)}
                    <br></br>
                    
              
                    <div className="likeDisplay">
                      
                      <i className='bx bx-upvote'></i>&nbsp;{like} &emsp;<i className='bx bx-downvote'></i>&nbsp;{dislike} 
                    </div>
                  </div>

                </div>
            </div>

            <div>
                <br></br>
              
              &nbsp;&nbsp; 
              {(session) ? 
              <div>

              <button class="greenButton" onClick={() => Like()}>
                &emsp;<i className='bx bx-upvote'></i>&emsp;
                </button > 
              
              &nbsp;&nbsp; 
              
              <button class="redButton" onClick={() => Dislike()}> 
              &emsp;<i className='bx bx-downvote'></i>&emsp;
              </button > 
              &nbsp;&nbsp;
              {(mine) ? <button > 
              &emsp;Resolve&emsp;
              </button > : "" } 
              
              &nbsp;&nbsp; 
              <button > 
                  &emsp;Reply&emsp;
              </button >  
              
              </div>
              : "" }

              
            </div>
          </div>
            <br></br>
        </div>;
}
