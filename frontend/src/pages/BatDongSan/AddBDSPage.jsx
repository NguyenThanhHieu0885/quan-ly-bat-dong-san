import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";

/* ---------- styles ---------- */
const inputClass =
  "w-full px-4 h-11 bg-white border border-slate-300 rounded-lg text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-200";

const labelClass =
  "block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2";

const sectionTitle =
  "text-lg font-bold text-blue-700 border-l-4 border-blue-500 pl-4";

const sectionClass =
  "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition";

/* ---------- validation ---------- */
const validateBDS = (d) => {
  const e = {};
  if (!d.tieude.trim()) e.tieude = "Vui lòng nhập tiêu đề";
  if (!d.giatri || d.giatri <= 0) e.giatri = "Giá phải > 0";
  if (!d.dientich || d.dientich <= 0) e.dientich = "Diện tích không hợp lệ";
  if (!d.diachi.trim()) e.diachi = "Vui lòng nhập địa chỉ";
  return e;
};

/* ---------- components ---------- */
const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  helper,
  type = "text",
}) => (
  <div>
    {label && <label className={labelClass}>{label}</label>}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`${inputClass} ${
        error ? "border-red-500 focus:ring-red-200" : ""
      }`}
    />
    {error ? (
      <p className="text-xs text-red-500 mt-1">{error}</p>
    ) : (
      helper && <p className="text-xs text-slate-400 mt-1">{helper}</p>
    )}
  </div>
);

const SelectField = ({ label, value, onChange, options }) => (
  <div>
    <label className={labelClass}>{label}</label>
    <select
      value={value}
      onChange={onChange}
      className={inputClass}
    >
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  </div>
);

const Stepper = ({ value, onChange }) => (
  <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white shadow-sm">
    <button
      onClick={() => value > 0 && onChange(value - 1)}
      className="px-3 py-2 hover:bg-slate-100"
    >
      −
    </button>
    <input
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full text-center outline-none text-sm"
    />
    <button
      onClick={() => onChange(value + 1)}
      className="px-3 py-2 hover:bg-slate-100"
    >
      +
    </button>
  </div>
);

/* ---------- main ---------- */
export default function AddBDSPage({ onBack }) {
  const [formData, setFormData] = useState({
    tieude: "",
    loaiid: "Nhà phố",
    tinhtrang: "Đã cho thuê",
    giatri: "",
    dientich: "",
    phongngu: 2,
    phongtam: 2,
    mota: "",
    diachi: "",
    quan: "Bình Thạnh",
    thanhpho: "Hồ Chí Minh",
  });

  const [errors, setErrors] = useState({});

  const update = (k, v) => setFormData((p) => ({ ...p, [k]: v }));

  const submit = () => {
    const err = validateBDS(formData);
    if (Object.keys(err).length) return setErrors(err);
    setErrors({});
    console.log("Submit OK:", formData);
  };

  return (
    <div className="bg-slate-100 min-h-screen py-8 px-6">
      <div className="max-w-7xl mx-auto">

        {/* BACK */}
        <button
          onClick={onBack}
          className="mb-6 text-sm font-medium text-slate-600 hover:text-blue-600 transition"
        >
          ← Quay lại
        </button>

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Thêm bất động sản
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Điền thông tin chi tiết để đăng tin
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-8 space-y-6">

            {/* BASIC */}
            <section className={sectionClass}>
              <div className="mb-6">
                <h2 className={sectionTitle}>Thông tin cơ bản</h2>
                <p className="text-sm text-slate-400 mt-1">
                  Thông tin chính của bất động sản
                </p>
              </div>

              <div className="space-y-6">

                <InputField
                  label="Tiêu đề"
                  value={formData.tieude}
                  onChange={(e) => update("tieude", e.target.value)}
                  placeholder="Căn hộ 2PN full nội thất, view sông"
                  error={errors.tieude}
                />

                <div className="grid grid-cols-2 gap-6">
                  <SelectField
                    label="Loại hình"
                    value={formData.loaiid}
                    onChange={(e) => update("loaiid", e.target.value)}
                    options={["Nhà phố", "Căn hộ", "Biệt thự"]}
                  />
                  <SelectField
                    label="Trạng thái"
                    value={formData.tinhtrang}
                    onChange={(e) => update("tinhtrang", e.target.value)}
                    options={["Đã cho thuê", "Còn trống"]}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <InputField
                    label="Giá"
                    type="number"
                    value={formData.giatri}
                    onChange={(e) => update("giatri", e.target.value)}
                    error={errors.giatri}
                  />
                  <InputField
                    label="Diện tích"
                    value={formData.dientich}
                    onChange={(e) => update("dientich", e.target.value)}
                    error={errors.dientich}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Phòng ngủ</label>
                    <Stepper value={formData.phongngu} onChange={(v) => update("phongngu", v)} />
                  </div>
                  <div>
                    <label className={labelClass}>Phòng tắm</label>
                    <Stepper value={formData.phongtam} onChange={(v) => update("phongtam", v)} />
                  </div>
                </div>

                <InputField
                  label="Mô tả"
                  value={formData.mota}
                  onChange={(e) => update("mota", e.target.value)}
                />

              </div>
            </section>

            {/* LOCATION */}
            <section className={sectionClass}>
              <div className="mb-6">
                <h2 className={sectionTitle}>Vị trí</h2>
                <p className="text-sm text-slate-400 mt-1">
                  Địa chỉ bất động sản
                </p>
              </div>

              <div className="space-y-6">
                <InputField
                  value={formData.diachi}
                  onChange={(e) => update("diachi", e.target.value)}
                  error={errors.diachi}
                />

                <div className="grid grid-cols-2 gap-6">
                  <InputField value={formData.quan} onChange={(e) => update("quan", e.target.value)} />
                  <SelectField
                    value={formData.thanhpho}
                    onChange={(e) => update("thanhpho", e.target.value)}
                    options={["Hồ Chí Minh", "Hà Nội"]}
                  />
                </div>
              </div>
            </section>

          </div>

          {/* RIGHT */}
          <div className="lg:col-span-4 space-y-6">

            <section className={sectionClass}>
              <h2 className={sectionTitle}>Chủ sở hữu</h2>
              <div className="space-y-4 mt-4">
                <input placeholder="Tên chủ nhà" className={inputClass} />
                <input placeholder="Số điện thoại" className={inputClass} />
              </div>
            </section>

            <section className={sectionClass}>
              <h2 className={sectionTitle}>Hình ảnh</h2>
              <div className="mt-4 border-2 border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center gap-3 text-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
                <FiUpload className="text-3xl text-blue-500" />
                <p className="text-sm font-medium text-slate-700">
                  Tải ảnh bất động sản
                </p>
                <p className="text-xs text-slate-400">
                  Kéo thả hoặc click
                </p>
              </div>
            </section>

            {/* ACTION */}
            <div className="sticky top-6 space-y-3 bg-white p-4 rounded-2xl border shadow-sm">
              <button
                onClick={submit}
                className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-sm hover:shadow-md transition-all"
              >
                Thêm bất động sản
              </button>

              <button
                onClick={onBack}
                className="w-full border py-3 rounded-xl text-sm hover:bg-slate-100 transition"
              >
                Hủy
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}