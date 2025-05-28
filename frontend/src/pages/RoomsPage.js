import { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, TextField, MenuItem } from '@mui/material';
import RoomCard from '../components/layouts/RoomCard';
import RoomFilter from '../components/layouts/RoomFilter';
import api from '../service/axiosConfig';

const RoomsPage = () => {
    const [rooms, setRooms] = useState([]);
    const [buildings, setBuildings] = useState([]);
    const [filters, setFilters] = useState({
        building: '',
        capacity: '',
        type: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            const [roomsRes, buildingsRes] = await Promise.all([
                api.get('rooms/'),
                api.get('buildings/'),
            ]);
            setRooms(roomsRes.data);
            setBuildings(buildingsRes.data);
        };
        fetchData();
    }, []);

    const filteredRooms = rooms.filter(room => {
        return (
            (filters.building === '' || room.building.id === Number(filters.building)) &&
            (filters.capacity === '' || room.capacity >= Number(filters.capacity)) &&
            (filters.type === '' || room.type === filters.type)
        );
    });

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Доступные аудитории
            </Typography>
            <RoomFilter
                buildings={buildings}
                filters={filters}
                setFilters={setFilters}
            />
            <Grid container spacing={3}>
                {filteredRooms.map(room => (
                    <Grid item xs={12} sm={6} md={4} key={room.id}>
                        <RoomCard room={room} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default RoomsPage;