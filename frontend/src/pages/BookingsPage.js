import { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip
} from '@mui/material';
import { Add, Cancel } from '@mui/icons-material';
import BookingForm from '../components/layouts/BookingForm';
import api from '../service/axiosConfig';
import dayjs from 'dayjs';

const statusColors = {
    pending: 'default',
    approved: 'success',
    rejected: 'error',
    canceled: 'warning'
};

const statusLabels = {
    pending: 'Ожидает',
    approved: 'Подтверждено',
    rejected: 'Отклонено',
    canceled: 'Отменено'
};

const BookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [openForm, setOpenForm] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const [bookingsRes, roomsRes] = await Promise.all([
                api.get('bookings/'),
                api.get('rooms/')
            ]);
            setBookings(bookingsRes.data);
            setRooms(roomsRes.data);
        };
        fetchData();
    }, []);

    const handleCancel = async (id) => {
        await api.post(`bookings/${id}/cancel/`);
        setBookings(bookings.map(b =>
            b.id === id ? { ...b, status: 'canceled' } : b
        ));
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
            }}>
                <Typography variant="h4">Мои бронирования</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setOpenForm(true)}
                >
                    Новое бронирование
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Аудитория</TableCell>
                            <TableCell>Дата и время</TableCell>
                            <TableCell>Цель</TableCell>
                            <TableCell>Статус</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bookings.map(booking => (
                            <TableRow key={booking.id}>
                                <TableCell>
                                    {rooms.find(r => r.id === booking.room)?.number || booking.room}
                                </TableCell>
                                <TableCell>
                                    {dayjs(booking.start_time).format('DD.MM.YYYY HH:mm')} -
                                    {dayjs(booking.end_time).format('HH:mm')}
                                </TableCell>
                                <TableCell>{booking.purpose}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={statusLabels[booking.status]}
                                        color={statusColors[booking.status]}
                                    />
                                </TableCell>
                                <TableCell>
                                    {booking.status === 'pending' && (
                                        <Button
                                            color="error"
                                            startIcon={<Cancel />}
                                            onClick={() => handleCancel(booking.id)}
                                        >
                                            Отменить
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <BookingForm
                room={selectedRoom}
                open={openForm}
                onClose={() => {
                    setOpenForm(false);
                    setSelectedRoom(null);
                }}
            />
        </Container>
    );
};

export default BookingsPage;