import express from 'express';
import cors from 'cors';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend encendido.");
});

app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto ${port}`);
});

import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: 'APP_USR-8822169072183254-031721-99106b49d580267355d08f9a2ccb9415-1730821699' });

app.post("/create_preference", async (req, res) => {
    try {
        const items = req.body.items.map(item => ({
            title: item.title,
            quantity: Number(item.quantity),
            currency_id: "COP",
            unit_price: Number(item.unit_price), 
        }));

        console.log("Items recibidos en el backend:", items);

        const body = {
            items: items,
            payment_methods: {
                excluded_payment_methods: [], // No excluyas ningún método de pago
                excluded_payment_types: [], // No excluyas ningún tipo de pago
            },
            back_urls: {
                success: "https://www.google.com/?hl=es",
                failure: "https://www.google.com/?hl=en",
                pending: "https://www.google.com/?hl=fr"
            },
            auto_return: "approved",
        };
        

        console.log("Preferencia a crear:", body);

        const preference = new Preference(client);
        const result = await preference.create({ body });
        res.json({
            id: result.id,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Error al crear la preferencia."
        });
    }
});
