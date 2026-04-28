import React, { useEffect, useState } from "react";
import { Table, Button, Input, Space, Card, Typography, message } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getBatDongSan, deleteBatDongSan } from "../../services/api";
import FormChiTietBDS from "./FormChiTietBDS";
import HinhAnhBDS from "./HinhAnhBDS";
import TraCuuBDS from "./FormTraCuuBDS";
import FormCapNhatBDS from './FormCapNhatBDS';

const DanhSachBDS = () => {
  const navigate = useNavigate();
  const [listBDS, setListBDS] = useState([]);
  const [originalListBDS, setOriginalListBDS] = useState([]);
  const [chiTietVisible, setChiTietVisible] = useState(false);
  const [selectedBDSId, setSelectedBDSId] = useState(null);
  const [selectedBDSRecord, setSelectedBDSRecord] = useState(null);
  const [isImgOpen, setIsImgOpen] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const fetchData = async () => {
    try {
      const response = await getBatDongSan();
      const data = Array.isArray(response.data) ? [...response.data].sort((a, b) => a.tinhtrang - b.tinhtrang) : [];
      setListBDS(data);
      setOriginalListBDS(data);
      setIsFiltered(false);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu:", error);
    }
  };

  useEffect(() => {
    const run = async () => {
      await fetchData();
    };
    run();
  }, []); //

  const handleOpenDetail = (record) => {
    setSelectedBDSId(record.bdsid);
    setSelectedBDSRecord(record);
    setChiTietVisible(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (record) => {
    if (record.tinhtrang === 1) {
      message.warning("Không thể xóa căn đã đặt cọc");
      return;
    }

    try {
      await deleteBatDongSan(record.bdsid);
      fetchData();
    } catch (error) {
      console.error("Xóa thất bại:", error);
    }
  };

  const columns = [
    {
      title: "Mã số QSDĐ",
      dataIndex: "masoqsdd",
      key: "masoqsdd",
      render: (text) => <b>{text}</b>,
    },
    { title: "Tên đường", dataIndex: "tenduong", key: "tenduong" },
    {
      title: "Diện tích",
      dataIndex: "dientich",
      render: (val) => `${val} m²`,
    },
    {
      title: "Đơn giá",
      dataIndex: "dongia",
      render: (val) => `${val?.toLocaleString()} VNĐ`,
    },
    {
      title: "Tình trạng",
      dataIndex: "tinhtrang",
      key: "tinhtrang",
      render: (val) => (val === 0 ? "Còn trống" : "Đặt cọc"),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => handleOpenDetail(record)}>
            Xem chi tiết
          </Button>

          <Button
            style={{
              backgroundColor: "#ffffff", 
              border: "2px solid #77d4a9", 
              borderColor: "#77d4a9"      
            }}
            onClick={() => handleEdit(record)}
          >
            Cập nhật
          </Button>
          <Button danger onClick={() => handleDelete(record)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      <Card>
        <Typography.Title level={2}>Quản Lý Bất Động Sản</Typography.Title>

        {/* Form Tra cứu Bất Động Sản */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            flexWrap: "wrap",
            gap: 10,
            marginBottom: 20,
          }}
        >
          {isFiltered && (
            <Button
              onClick={() => {
                setListBDS(originalListBDS);
                setIsFiltered(false);
              }}
            >
              &larr; Quay về danh sách
            </Button>
          )}
          <Button
            icon={<SearchOutlined />}
            onClick={() => setIsSearchOpen(true)}
          >
            Tra cứu Bất động sản
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/bat-dong-san/add")}
          >
            Thêm Bất động sản
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={listBDS}
          rowKey="bdsid"
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {/* Form chi tiết bất động sản */}
      <FormChiTietBDS
        record={selectedBDSRecord}
        visible={chiTietVisible}
        onCancel={() => setChiTietVisible(false)}
      />

      {/* Form hình ảnh bất động sản */}
      <HinhAnhBDS
        bdsId={selectedBDSId}
        visible={isImgOpen}
        onCancel={() => setIsImgOpen(false)}
      />

      {/* Form tra cứu bất động sản */}
      <TraCuuBDS
        visible={isSearchOpen}
        onCancel={() => {
          setIsSearchOpen(false);
          setListBDS(originalListBDS);
          setIsFiltered(false);
        }}
        onSearchSuccess={(results) => {
          setListBDS(results);
          setIsFiltered(true);
          setIsSearchOpen(false);
        }}
      />

      {/* Form cập nhật bất động sản */}
      <FormCapNhatBDS
        visible={isModalOpen}
        record={editingRecord}
        onCancel={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchData();
        }}
      />
    </div>
  );
};

export default DanhSachBDS;
