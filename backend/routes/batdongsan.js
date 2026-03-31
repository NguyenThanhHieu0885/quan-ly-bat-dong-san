router.get('/:id', async (req, res) => {
  try {
    const bds = await BatDongSan.findByPk(req.params.id);
    if (!bds) return res.status(404).json({ message: "Không tìm thấy bất động sản" });
    res.json(bds);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});