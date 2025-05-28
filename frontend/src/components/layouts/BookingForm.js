import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    MenuItem,
    Typography
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import api from '../../service/axiosConfig';

const BookingForm = ({ room, open, onClose }) => {
    const [startTime, setStartTime] = useState(dayjs().add(1, 'hour'));
    const [endTime, setEndTime] = useState(dayjs().add(2, 'hour'));
    const [purpose, setPurpose] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const purposes = [
        'Лекция',
        'Семинар',
        'Лабораторная работа',
        'Консультация',
        'Экзамен',
        'Собрание'
    ];

    const handleSubmit = async () => {
        try {
            await api.post('bookings/', {
                room_id: room.id,
                start_time: startTime.toISOString(),
                end_time: endTime.toISOString(),
                purpose
            });
            onClose();
            navigate('/bookings');
        } catch (err) {
            setError(err.response?.data?.detail || 'Ошибка при создании бронирования');
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Бронирование аудитории {room.number}</DialogTitle>
            <DialogContent>
                <TextField
                    select
                    fullWidth
                    margin="normal"
                    label="Цель бронирования"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                >
                    {purposes.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
                <DateTimePicker
                    label="Начало"
                    value={startTime}
                    onChange={setStartTime}
                    minDateTime={dayjs()}
                    renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                />
                <DateTimePicker
                    label="Окончание"
                    value={endTime}
                    onChange={setEndTime}
                    minDateTime={startTime.add(30, 'minute')}
                    renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                />
                {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Отмена</Button>
                <Button onClick={handleSubmit} variant="contained">Забронировать</Button>
            </DialogActions>
        </Dialog>
    );
};

export default BookingForm;