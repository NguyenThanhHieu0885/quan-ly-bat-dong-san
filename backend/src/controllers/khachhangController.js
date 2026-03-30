const service = require('../services/khachhangService');

const khachhangController = {
    search: async (req, res) => {
        try { res.json(await service.search(req.query.q)); }
        catch (e) { res.status(404).json({ message: e.message }); }
    },
    create: async (req, res) => {
        try { res.status(201).json(await service.create(req.body)); }
        catch (e) { res.status(400).json({ message: e.message }); }
    },
    update: async (req, res) => {
        try { res.json(await service.update(req.params.id, req.body)); }
        catch (e) { res.status(400).json({ message: e.message }); }
    },
    delete: async (req, res) => {
        try { await service.delete(req.params.id); res.json({ message: "Xóa thành công" }); }
        catch (e) { res.status(400).json({ message: e.message }); }
    },
    addRequest: async (req, res) => {
        try { res.status(201).json(await service.request(req.body)); }
        catch (e) { res.status(400).json({ message: e.message }); }
    }
};

module.exports = khachhangController;