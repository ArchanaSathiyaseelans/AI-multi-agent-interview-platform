import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { motion } from "motion/react";
import { FiSidebar, FiPlus } from 'react-icons/fi';
import { getAllInterviews } from '../apis/interview.api';
import Statbox from '../components/Statbox';
import InterviewGraph from '../components/InterviewGraph';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';

function Dashboard({ user, setUser }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [moblieOpen, setMoblieOpen] = useState(false);
  const [stats, setStats] = useState({
    totalInterviews: 0,
    totalQuestions: 0,
    completed: 0,
    averageScore: 0,
  });

  const [technicalData, setTechnicalData] = useState([]);
  const [hrData, setHrData] = useState([]);
  const [technicalCount, setTechnicalCount] = useState(0);
  const [hrCount, setHrCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await getAllInterviews();
        if (response) {
          setStats(response.stats);
          setTechnicalData(response.technicalData);
          setHrData(response.hrData);
          setTechnicalCount(response.technicalCount);
          setHrCount(response.hrCount);
        }
      } catch (err) {
        console.error("Failed to load interview history:", err);
      }
    };

    fetchInterviews();
  }, []);

  const handleLogout = async () => {
    try {
      if (auth && auth.currentUser) {
        await signOut(auth);
      }
      await api.post("/api/auth/logout");
    } catch (error) {
      console.log("Logout error:", error);
    } finally {
      setUser(null);
      navigate("/");
    }
  };

  return (
    <div className='bg-[#FAFAFA] dark:bg-[#0A0A0C] min-h-screen text-slate-900 dark:text-zinc-100 font-sans flex transition-colors duration-200'>
      <Sidebar
        user={user}
        setUser={setUser}
        onNewInterview={() => navigate("/interview")}
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        moblieOpen={moblieOpen}
        setMoblieOpen={setMoblieOpen}
      />

      <motion.main className={`flex-1 min-h-screen px-4 md:px-8 py-6 transition-all duration-300 ${
        sidebarOpen ? "md:ml-[260px]" : "md:ml-[72px]"
      }`}>

        {/* Top Area */}
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-3'>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMoblieOpen(true)}
              className='md:hidden text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors p-1'>
              <FiSidebar size={18} />
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p className='text-slate-400 dark:text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-0.5'>Dashboard</p>
              <h2 className='text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white'>
                Hello, {user?.name?.split(" ")[0]} 👋
              </h2>
            </motion.div>
          </div>

          <motion.button
            onClick={() => navigate("/interview")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className='flex items-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-semibold rounded-xl px-4 py-2 text-xs shadow-md transition-all cursor-pointer'
          >
            <FiPlus size={15} />
            <span className='hidden sm:inline'>New Interview</span>
          </motion.button>
        </div>

        <div className='h-px bg-black/8 dark:bg-white/10 mb-6' />

        {/* Stat Boxes */}
        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8'>
          <Statbox
            label="Total Interviews"
            value={stats?.totalInterviews}
            subHighlight="All Time"
            sub="Interviews Created"
            index={0}
          />

          <Statbox
            label="Questions Solved"
            value={stats?.totalQuestions}
            subHighlight="Answered"
            sub="Across All Sessions"
            index={1}
          />

          <Statbox
            label="Completed"
            value={stats?.completed}
            subHighlight={`${stats?.totalInterviews || 0} Total`}
            sub="Finished Sessions"
            index={2}
          />

          <Statbox
            label="Average Score"
            value={`${Math.round(stats?.averageScore || 0)}/100`}
            subHighlight="Completed"
            sub="Overall Score"
            index={3}
          />
        </div>

        {/* Performance & Charts */}
        <motion.div  
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-4">
          <p className='text-slate-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1'>
            Performance Analytics
          </p>
          <h3 className='text-slate-900 dark:text-white font-extrabold text-base md:text-lg mb-4'>
            Skill Radar & Performance
          </h3>
        </motion.div>

        <InterviewGraph
          technicalData={technicalData}
          technicalCount={technicalCount}
          hrData={hrData}
          hrCount={hrCount}
        />
      </motion.main>
    </div>
  );
}

export default Dashboard;
