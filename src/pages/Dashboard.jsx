import React, { useEffect, useState } from "react";
import "../styles.css"
import { Link, useLocation } from 'react-router-dom';
import { supabase } from "../supabaseClient";
import ComplaintBox from "../components/dashboard/ComplaintBox";

function Dashboard() {

    const [cells, setCell] = useState([]);

    const getData = async () => {
        const { data, error } = await supabase
          .from('COMPLAINT')
          .select('*')
          .order('id', { ascending: false });

      setCell(data);
      // console.log("TESTTTT")
    };



    const [session, setSession] = useState(null)

    useEffect(() => {
      setSession(supabase.auth.session())

      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
      })
    }, [])


    useEffect(() => {
        getData()
      }, []);
      

     const data = React.useMemo(() => cells, []);
    //  console.log("HELLO WRODL!!!");



    return <div className="App">
      
          <header className="App-title">
              <p ><b>
              GT Complaints</b>
              </p>
          </header>
          {(!session) ? "Log in to gain access to voting and replying." : ""}
          <br></br>
          <br></br>
          <button onClick={getData}> Refresh</button > 
          <Link to="/add" >
          &nbsp;&nbsp;
          <button> Add</button > 
          </Link>
          <div className="Box-center">
          <br></br>
          
          {console.log("HELLOOO!")}
            {
              cells.map((item, index) => (
                 <ComplaintBox key={index} session={session} id={item.id} subj={item.subj} desc={item.desc} upv={item.upv} dov={item.dov} time={item.time} date={item.date} anon={item.anon} userID={item.userID} /> 
               ))
            }
          
          </div>
          <br></br><br></br>
          
          
          

          
      </div>;
};

export default Dashboard;