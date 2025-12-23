import React, { useEffect, useState } from 'react';
import { deskService } from '../api/deskService';
import { Desk, DeskStatus, User } from '../types';
import './DeskGrid.css';

interface DeskGridProps {
    currentUser: User;
}

const DeskGrid: React.FC<DeskGridProps> = ({ currentUser }) => {
    const [desks, setDesks] = useState<Desk[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [bookingDeskId, setBookingDeskId] = useState<number | null>(null);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    useEffect(() => {
        fetchDesks();

        // Auto-refresh data every 30 seconds
        const interval = setInterval(fetchDesks, 30000);

        return () => clearInterval(interval);
    }, []);

    // Atnaujiname stalus is API. Naudojame loading state, kad vartotojas matytu krovimosi progresa.
    const fetchDesks = async () => {
        try {
            setLoading(true);
            const data = await deskService.getDesks();
            setDesks(data);
            setError(null);
        } catch (err) {
            setError('Nepavyko užkrauti stalų sąrašo.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Siunciame rezervacijos duomenis i serveri. Po sekmingo veiksmo isvalome laukus ir atnaujiname sarasa.
    const handleBook = async () => {
        if (!bookingDeskId || !startDate || !endDate) {
            alert("Prašome užpildyti visas datas.");
            return;
        }

        try {
            await deskService.bookDesk({
                deskId: bookingDeskId,
                userId: currentUser.id,
                userFullName: currentUser.fullName,
                startDate: new Date(startDate).toISOString(),
                endDate: new Date(endDate).toISOString()
            });
            alert('Rezervacija sėkminga!');
            setBookingDeskId(null); // uzdaryti datu pasirinkima
            setStartDate(''); // isvalyti datas
            setEndDate('');
            fetchDesks(); // atnaujinam sarasa
        } catch (err: any) {
            alert(err.response?.data || 'Rezervacija nepavyko.');
        }
    };

    const handleCancel = async (reservationId: number) => {
        if (!window.confirm('Ar tikrai norite atšaukti rezervaciją?')) return;

        try {
            await deskService.cancelReservation(reservationId);
            alert('Rezervacija atšaukta!');
            fetchDesks();
        } catch (err: any) {
            const errorData = err.response?.data;
            const errorMessage = errorData?.message || (typeof errorData === 'string' ? errorData : 'Nepavyko atšaukti rezervacijos.');
            alert(errorMessage);
        }
    };

    if (loading) return <div className="loader">Kraunama...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="desk-container">
            <header className="grid-header">
                <h1>Stalų Rezervacija</h1>
                <p>Pasirinkite laisvą stalą savo darbui</p>
            </header>

            <div className="grid-layout">
                {desks.map((desk) => (
                    // Korteles statusas priklauso nuo desk.status reikšmes.
                    // Cia tikriname ar vartotojas turi teise atsaukti rezervacija (tik savo).
                    <div key={desk.id} className={`desk-card status-${DeskStatus[desk.status].toLowerCase()}`}>
                        <div className="desk-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 19V9C4 7.89543 4.89543 7 6 7H18C19.1046 7 20 7.89543 20 9V19M4 19H20M4 19V21M20 19V21M12 7V3M8 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="desk-info">
                            <h3>Stalas #{desk.number}</h3>
                            <span className="status-badge">{DeskStatus[desk.status]}</span>
                            {desk.reservedBy && (
                                <div className="reservation-details">
                                    <p className="reserved-by">Rezervavo: {desk.reservedBy}</p>
                                    {desk.reservationStart && desk.reservationEnd && (
                                        <p className="reservation-time">
                                            {new Date(desk.reservationStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(desk.reservationEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    )}
                                </div>
                            )}
                            {desk.maintenanceInfo && <p className="maintenance-info">{desk.maintenanceInfo}</p>}
                        </div>

                        {desk.status === DeskStatus.Open ? (
                            bookingDeskId === desk.id ? (
                                <div className="booking-form">
                                    <div className="input-group">
                                        <label>Nuo:</label>
                                        <input
                                            type="datetime-local"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Iki:</label>
                                        <input
                                            type="datetime-local"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-actions">
                                        <button className="confirm-btn" onClick={handleBook}>Patvirtinti</button>
                                        <button className="cancel-small" onClick={() => setBookingDeskId(null)}>Atšaukti</button>
                                    </div>
                                </div>
                            ) : (
                                <button className="book-button" onClick={() => setBookingDeskId(desk.id)}>
                                    Rezervuoti
                                </button>
                            )
                        ) : desk.status === DeskStatus.Reserved ? (
                            desk.reservedById === currentUser.id ? (
                                <button
                                    className="cancel-button"
                                    onClick={() => desk.currentReservationId && handleCancel(desk.currentReservationId)}
                                >
                                    Atšaukti
                                </button>
                            ) : (
                                <button className="book-button" disabled>
                                    Užimta
                                </button>
                            )
                        ) : (
                            <button className="book-button" disabled>
                                Užimta
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DeskGrid;
