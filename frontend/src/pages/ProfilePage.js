import { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    TextField,
    Button,
    Avatar,
    Grid
} from '@mui/material';
import { Edit, Save } from '@mui/icons-material';
import api from '../service/axiosConfig';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const fetchUser = async () => {
            const response = await api.get('users/me/');
            setUser(response.data);
            setFormData(response.data);
        };
        fetchUser();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            await api.patch(`users/${user.id}/`, formData);
            setUser(formData);
            setEditMode(false);
        } catch (error) {
            console.error('Ошибка при обновлении профиля:', error);
        }
    };

    if (!user) return <div>Загрузка...</div>;

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar sx={{
                    width: 120,
                    height: 120,
                    fontSize: 48,
                    mb: 3,
                    bgcolor: 'primary.main'
                }}>
                    {user.first_name[0]}{user.last_name[0]}
                </Avatar>

                <Typography variant="h4" gutterBottom>
                    {user.first_name} {user.last_name}
                </Typography>

                <Paper sx={{ p: 3, width: '100%', mt: 2 }}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 3
                    }}>
                        <Typography variant="h6">Личные данные</Typography>
                        {editMode ? (
                            <Button
                                variant="contained"
                                startIcon={<Save />}
                                onClick={handleSave}
                            >
                                Сохранить
                            </Button>
                        ) : (
                            <Button
                                variant="outlined"
                                startIcon={<Edit />}
                                onClick={() => setEditMode(true)}
                            >
                                Редактировать
                            </Button>
                        )}
                    </Box>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Имя"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                fullWidth
                                disabled={!editMode}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Фамилия"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                fullWidth
                                disabled={!editMode}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                fullWidth
                                disabled={!editMode}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Телефон"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                fullWidth
                                disabled={!editMode}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Кафедра/Факультет"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                fullWidth
                                disabled={!editMode}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Роль"
                                value={user.role}
                                fullWidth
                                disabled
                            />
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </Container>
    );
};

export default ProfilePage;