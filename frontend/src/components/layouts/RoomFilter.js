import { Box, TextField, MenuItem } from '@mui/material';

const RoomFilter = ({ buildings, filters, setFilters }) => {
    const roomTypes = [
        { value: '', label: 'Все типы' },
        { value: 'lecture', label: 'Лекционная' },
        { value: 'lab', label: 'Лаборатория' },
        { value: 'conference', label: 'Конференц-зал' },
        { value: 'other', label: 'Другое' },
    ];

    return (
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
                select
                label="Корпус"
                value={filters.building}
                onChange={(e) => setFilters({ ...filters, building: e.target.value })}
                sx={{ minWidth: 200 }}
            >
                <MenuItem value="">Все корпуса</MenuItem>
                {buildings.map((building) => (
                    <MenuItem key={building.id} value={building.id}>
                        {building.name}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                select
                label="Тип"
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                sx={{ minWidth: 200 }}
            >
                {roomTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                        {type.label}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                label="Вместимость от"
                type="number"
                value={filters.capacity}
                onChange={(e) => setFilters({ ...filters, capacity: e.target.value })}
                sx={{ minWidth: 200 }}
            />
        </Box>
    );
};

export default RoomFilter;