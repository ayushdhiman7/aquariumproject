import React, { useState, useRef } from "react";
import { toPng } from "html-to-image";

function Buy_Tickets() {
  const ticketRef = useRef(null);
  // Plus count
  // Restore any previously booked ticket from localStorage
  const stored = (() => {
    try {
      return JSON.parse(localStorage.getItem("aq_booking")) || {};
    } catch {
      return {};
    }
  })();

  const [count, setCount] = useState(stored.count ?? 0);
  const [change, setChange] = useState(stored.change ?? 0);
  const [time, settime] = useState(stored.time ?? "");
  const [date, setdate] = useState(stored.date ?? "");

  const [isformSubmited, setisformSubmited] = useState(
    stored.submitted ?? false
  );

  // Form validation
  const [user, setuser] = useState(stored.user ?? "");
  const [pass, setpass] = useState(stored.pass ?? "");
  const [UserErr, setuserErr] = useState(false);
  const [PassErr, setPassErr] = useState(false);

  function userhandler(e) {
    let items = e.target.value;
    if (items.length <= 3) {
      setuserErr(true);
    } else {
      setuserErr(false);
    }
    setuser(items);
  }

  function passhandler(e) {
    let items = e.target.value;
    // Check if items length is 10 and all characters are numbers
    if (items.length === 10 && /^[0-9]+$/.test(items)) {
      setPassErr(false); // Valid input, no error
    } else {
      setPassErr(true); // Invalid input, show error
    }
    setpass(items);
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Check if form fields meet the basic criteria
    if (user.length > 3 && pass.length === 10 && /^[0-9]+$/.test(pass)) {
      const booking = { user, pass, date, time, count, change, submitted: true };
      localStorage.setItem("aq_booking", JSON.stringify(booking));
      setisformSubmited(true);
      alert("Congratulations, Your ticket booked 🎉🎫✈️");
    } else {
      alert("Please fill the form correctly");
    }
  }

  function handleNewBooking() {
    localStorage.removeItem("aq_booking");
    setuser("");
    setpass("");
    setdate("");
    settime("");
    setCount(0);
    setChange(0);
    setisformSubmited(false);
  }

  async function handleDownload() {
    if (!ticketRef.current) return;
    try {
      const dataUrl = await toPng(ticketRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        skipFonts: true,
        backgroundColor: "transparent",
      });
      const link = document.createElement("a");
      link.download = "national-aquarium-ticket.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      alert("Sorry, the ticket could not be downloaded. Please try again.");
      console.error(err);
    }
  }

  return (
    <>
      {/* After Submit */}
      <div className="tick-form">
        <div id="booking" className="section">
          <div className="section-center">
            <div className="container">
              <div className="row">
                <div className="booking-form">
                  {isformSubmited ? (
                    <div className="ticket-view">
                      <div className="aq-ticket" ref={ticketRef}>
                        <div className="card">
                          <div className="notes">♪♪♪♪♪</div>
                          <div className="notes">♪♪♪♪</div>
                          <div className="notes">♪♪♪♪♪</div>

                          <div className="header">
                            TICKET
                            <div className="symbol">✁</div>
                          </div>
                          <div className="body">
                            <em>Admission Pass</em>
                            <br />
                            {date || "—"}
                            {time ? `  ·  ${time}` : ""}
                            <br />
                            National Aquarium, Baltimore
                          </div>
                          <div className="footer">
                            <div className="number">
                              Guests{" "}
                              <span className="bold">{count + change}</span>
                            </div>
                            <div className="barcode"></div>
                          </div>

                          <div className="bg holographic"></div>
                          <svg className="filter">
                            <filter id="bump">
                              <feTurbulence
                                result="noise"
                                numOctaves="3"
                                baseFrequency="0.7"
                                type="fractalNoise"
                              ></feTurbulence>
                              <feSpecularLighting
                                in="noise"
                                result="specular"
                                lightingColor="#fffffc"
                                specularExponent="25"
                                specularConstant="0.8"
                                surfaceScale="0.15"
                              >
                                <fePointLight
                                  z="210"
                                  y="100"
                                  x="100"
                                ></fePointLight>
                              </feSpecularLighting>
                              <feComposite
                                result="noise2"
                                operator="in"
                                in="specular"
                                in2="SourceGraphic"
                              ></feComposite>
                              <feBlend
                                mode="screen"
                                in2="noise2"
                                in="SourceGraphic"
                              ></feBlend>
                            </filter>
                          </svg>
                        </div>

                        <div className="ticket-meta">
                          <p className="ticket-name">{user}</p>
                          <p className="ticket-sub">
                            Booking confirmed{pass ? ` · ${pass}` : ""}
                          </p>
                        </div>
                      </div>

                      <div className="ticket-actions">
                        <button
                          type="button"
                          className="submit-btn ticket-download-btn"
                          onClick={handleDownload}
                        >
                          Download Ticket
                        </button>
                        <button
                          type="button"
                          className="ticket-new-btn"
                          onClick={handleNewBooking}
                        >
                          Book another visit
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Before Submit
                    <>
                      <div className="booking-bg" />
                      <form onSubmit={handleSubmit} className="formbody">
                      <div className="form-header">
                        <h2>Make your Visit</h2>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <span className="form-label">Check In</span>
                            <input
                              className="form-control"
                              name="date"
                              onChange={(e) => setdate(e.target.value)}
                              type="date"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <span className="form-label">Check In Time</span>
                            <input
                              className="form-control"
                              name="time"
                              onChange={(e) => settime(e.target.value)}
                              type="time"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <span className="form-label">Adults</span>
                            <br />
                            <span className="form-control">
                              <button
                                type="button"
                                className="plus"
                                onClick={() => count > 0 && setCount(count - 1)}
                              >
                                -
                              </button>
                              <input type="number" name="adult" value={count} />
                              <button
                                type="button"
                                className="plus"
                                onClick={() => setCount(count + 1)}
                              >
                                +
                              </button>
                            </span>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <span className="form-label">Children</span>
                            <br />
                            <span className="form-control">
                              <button
                                type="button"
                                className="plus"
                                onClick={() =>
                                  change > 0 && setChange(change - 1)
                                }
                              >
                                -
                              </button>
                              <input
                                type="number"
                                name="child"
                                value={change}
                              />
                              <button
                                type="button"
                                className="plus"
                                onClick={() => setChange(change + 1)}
                              >
                                +
                              </button>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <span className="form-label">Name</span>
                        <input
                          name="name"
                          value={user}
                          onChange={userhandler}
                          className="form-control"
                          type="Text"
                          placeholder="Enter your Name"
                        />
                        {UserErr && (
                          <span style={{ color: "red" }}>
                            Name should contain Min* 5 letters
                          </span>
                        )}
                      </div>

                      <div className="form-group">
                        <span className="form-label">Phone</span>
                        <input
                          value={pass}
                          onChange={passhandler}
                          className="form-control"
                          type="tel"
                          placeholder="Enter your phone number"
                          name="phone"
                        />
                        {PassErr && (
                          <span style={{ color: "red" }}>
                            Not Valid, please enter exactly 10 digits.
                          </span>
                        )}
                      </div>
                      <div className="form-btn">
                        <button type="submit" className="submit-btn">
                          Book Now
                        </button>
                      </div>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Buy_Tickets;

//name
//phone
//date
//time
//adult
//child
