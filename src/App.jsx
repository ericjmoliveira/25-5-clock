import { useEffect, useRef, useState } from 'react';

import './App.css';

function App() {
	const [breakLength, setBreakLength] = useState(5);
	const [sessionLength, setSessionLength] = useState(25);
	const [sessionTime, setSessionTime] = useState(1500);
	const [isSessionOn, setIsSessionOn] = useState(false);
	const [isBreakOn, setIsBreakOn] = useState(false);

	const audioBeep = useRef();

	const clock = `${String(Math.floor(sessionTime / 60)).padStart(2, '0')}:${String(
		sessionTime % 60
	).padStart(2, '0')}`;

	const incrementBreak = () => {
		if (breakLength === 60) return;

		setBreakLength((prevBreakLength) => prevBreakLength + 1);
	};

	const decrementBreak = () => {
		if (breakLength === 1) return;

		setBreakLength((prevBreakLength) => prevBreakLength - 1);
	};

	const incrementSession = () => {
		if (sessionLength === 60) return;

		setSessionLength((prevBreakLength) => prevBreakLength + 1);
		setSessionTime((prevSessionTime) => prevSessionTime + 60);
	};

	const decrementSession = () => {
		if (sessionLength === 1) return;

		setSessionLength((prevBreakLength) => prevBreakLength - 1);
		setSessionTime((prevSessionTime) => prevSessionTime - 60);
	};

	const resetSessionCountdown = () => {
		audioBeep.current.load();
		setSessionTime(1500);
		setIsSessionOn(false);
		setIsBreakOn(false);
		setBreakLength(5);
		setSessionLength(25);
	};

	useEffect(() => {
		if (!isSessionOn && !isBreakOn) return;
		if (sessionTime === 0 && isSessionOn) {
			audioBeep.current.play();
			const interTimer = setTimeout(() => {
				setSessionTime(breakLength * 60);
				setIsSessionOn((prevSession) => !prevSession);
				setIsBreakOn((prevBreak) => !prevBreak);
			}, 1000);

			return () => clearTimeout(interTimer);
		}

		if (sessionTime === 0 && isBreakOn) {
			audioBeep.current.play();
			const interTimer = setTimeout(() => {
				setSessionTime(sessionLength * 60);
				setIsSessionOn((prevSession) => !prevSession);
				setIsBreakOn((prevBreak) => !prevBreak);
			}, 1000);

			return () => clearTimeout(interTimer);
		}

		const sessionTimer = setTimeout(() => {
			setSessionTime((prevSessionTime) => prevSessionTime - 1);
		}, 1000);

		return () => clearTimeout(sessionTimer);
	}, [sessionTime, isSessionOn, isBreakOn]);

	return (
		<div className="container">
			<h1 className="title">25 + 5 Clock</h1>
			<div className="settings-container">
				<div className="break-container">
					<h3 id="break-label">Break Length</h3>
					<div>
						<button
							id="break-decrement"
							onClick={() => decrementBreak()}
							disabled={isSessionOn || isBreakOn}
						>
							Decrement break
						</button>
						<h3 id="break-length">{breakLength}</h3>
						<button
							id="break-increment"
							onClick={() => incrementBreak()}
							disabled={isSessionOn || isBreakOn}
						>
							Increment break
						</button>
					</div>
				</div>
				<div className="session-container">
					<h3 id="session-label">Session Length</h3>
					<div>
						<button
							id="session-decrement"
							onClick={() => decrementSession()}
							disabled={isSessionOn || isBreakOn}
						>
							Decrement session
						</button>
						<h3 id="session-length">{sessionLength}</h3>
						<button
							id="session-increment"
							onClick={() => incrementSession()}
							disabled={isSessionOn || isBreakOn}
						>
							Increment session
						</button>
					</div>
				</div>
			</div>
			<div className="timer-container">
				<h3 id="timer-label">{isBreakOn ? 'Break' : 'Session'}</h3>
				<h2 id="time-left">{clock}</h2>
				<div>
					<button
						id="start_stop"
						onClick={() => setIsSessionOn((prevSession) => !prevSession)}
					>
						Start/stop
					</button>
					<button id="reset" onClick={() => resetSessionCountdown()}>
						Reset
					</button>
				</div>
			</div>
			<audio
				id="beep"
				ref={audioBeep}
				src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
			></audio>
		</div>
	);
}

export default App;
