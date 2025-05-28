import { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Tabs,
    Tab,
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button
} from '@mui/material';
import {
    Check as ApproveIcon,
    Close as RejectIcon,
    People as UsersIcon,
    MeetingRoom as RoomsIcon,
    Event as BookingsIcon
} from '@mui/icons-material';
import api from '../service/axiosConfig';
import dayjs from 'dayjs';

const AdminPage = () => {
    const [tab, setTab] = useState(0);
    const [pendingBookings, setPendingBookings] = useState([]);
    const [users, setUsers] = useState([]);
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (tab === 0) {
                const res = await api.get('bookings/?status=pending');
                setPendingBookings(res.data);
            } else if (tab === 1) {
                const res = await api.get('users/');
                setUsers(res.data);
            } else if (tab === 2) {
                const res = await api.get('rooms/');
                setRooms(res.data);
            }
        };
        fetchData();
    }, [tab]);

    const handleApprove = async (id) => {
        await api.post(`bookings/${id}/approve/`);
        setPendingBookings(pendingBookings.filter(b => b.id !== id));
    };

    const handleReject = async (id) => {
        await api.post(`bookings/${id}/reject/`);
        setPendingBookings(pendingBookings.filter(b => b.id !== id));
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>
                Административная панель
            </Typography>

            <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
                <Tab icon={<BookingsIcon />} label="Бронирования" />
                <Tab label="Пользователи" />
                <Tab icon={<RoomsIcon />} label="Аудитории" />
            </Tabs>

            <Box sx={{ mt: 3 }}>
                {tab === 0 && (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Пользователь</TableCell>
                                    <TableCell>Аудитория</TableCell>
                                    <TableCell>Дата и время</TableCell>
                                    <TableCell>Цель</TableCell>
                                    <TableCell>Действия</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pendingBookings.map(booking => (
                                    <TableRow key={booking.id}>
                                        <TableCell>{booking.user.username}</TableCell>
                                        <TableCell>{booking.room.number}</TableCell>
                                        <TableCell>
                                            {dayjs(booking.start_time).format('DD.MM.YYYY HH:mm')} -
                                            {dayjs(booking.end_time).format('HH:mm')}
                                        </TableCell>
                                        <TableCell>{booking.purpose}</TableCell>
                                        <TableCell>
                                            <Button
                                                color="success"
                                                startIcon={<ApproveIcon />}
                                                onClick={() => handleApprove(booking.id)}
                                                sx={{ mr: 1 }}
                                            >
                                                Подтвердить
                                            </Button>
                                            <Button
                                                color="error"
                                                startIcon={<RejectIcon />}
                                                onClick={() => handleReject(booking.id)}
                                            >
                                                Отклонить
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {tab === 1 && (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Имя</TableCell>
                                    <TableCell>Роль</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Телефон</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map(user => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.first_name} {user.last_name}</TableCell>
                                        <TableCell>
                                            <Chip label={user.role} color="primary" />
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.phone}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {tab === 2 && (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Номер</TableCell>
                                    <TableCell>Корпус</TableCell>
                                    <TableCell>Тип</TableCell>
                                    <TableCell>Вместимость</TableCell>
                                    <TableCell>Этаж</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rooms.map(room => (
                                    <TableRow key={room.id}>
                                        <TableCell>{room.number}</TableCell>
                                        <TableCell>{room.building.name}</TableCell>
                                        <TableCell>{room.type}</TableCell>
                                        <TableCell>{room.capacity}</TableCell>
                                        <TableCell>{room.floor}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
        </Container>
    );
};

export default AdminPage;