import { Card, CardContent, Typography, Button, Chip, Box } from '@mui/material';
import { Room as RoomIcon } from '@mui/icons-material';

const RoomCard = ({ room }) => {
    return (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <RoomIcon color="primary" />
                    <Typography variant="h6">Аудитория {room.number}</Typography>
                </Box>
                <Typography>Корпус: {room.building.name}</Typography>
                <Typography>Тип: {room.type}</Typography>
                <Typography>Вместимость: {room.capacity} чел.</Typography>
                <Box sx={{ mt: 2 }}>
                    {room.has_projector && <Chip label="Проектор" size="small" sx={{ mr: 1 }} />}
                    {room.has_whiteboard && <Chip label="Доска" size="small" sx={{ mr: 1 }} />}
                    {room.has_computers && <Chip label="Компьютеры" size="small" />}
                </Box>
                <Button variant="contained" fullWidth sx={{ mt: 2 }}>
                    Забронировать
                </Button>
            </CardContent>
        </Card>
    );
};

export default RoomCard;