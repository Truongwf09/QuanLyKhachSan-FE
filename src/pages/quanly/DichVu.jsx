import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import api from "../../services/api";
import "../../styles/DichVu.css";

export default function DichVu() {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    /* =========================
        STATE
    ========================= */

    const [services, setServices] = useState([]);

    const [branches, setBranches] = useState([]);

    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);

    const [editing, setEditing] = useState(null);

    const [search, setSearch] = useState("");

    const [branchFilter, setBranchFilter] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 8;

    const [form, setForm] = useState({

        TenDV: "",

        GiaDV: "",

        MoTa: "",

        MaCN:
            user.role === "admin"
                ? ""
                : user.MaCN

    });

    /* =========================
        LOAD DATA
    ========================= */

    useEffect(() => {

        loadServices();

        if (user.role === "admin") {

            loadBranches();

        }

    }, []);

    const loadServices = async () => {

        try {

            setLoading(true);

            const res =
                await api.get("/dichvu");

            setServices(res.data);

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setLoading(false);

        }

    };

    const loadBranches = async () => {

        try {

            const res =
                await api.get("/chinhanh");

            setBranches(res.data);

        }

        catch (err) {

            console.log(err);

        }

    };

    /* =========================
        SEARCH
    ========================= */

    const filteredServices = useMemo(() => {

        return services.filter(item => {

            const matchName =
                item.TenDV
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    );

            const matchBranch =
                !branchFilter ||

                item.MaCN === branchFilter;

            return (
                matchName &&
                matchBranch
            );

        });

    }, [

        services,

        search,

        branchFilter

    ]);

    /* =========================
        STATISTIC
    ========================= */

    const totalService =
        filteredServices.length;

    const activeService =
        filteredServices.filter(

            x => Number(x.TrangThai) === 1

        ).length;

    const hiddenService =
        filteredServices.filter(

            x => Number(x.TrangThai) === 0

        ).length;

    const statistic = [

        {

            title: "Tổng dịch vụ",

            value: totalService,

            color: "#2563eb"

        },

        {

            title: "Đang hoạt động",

            value: activeService,

            color: "#16a34a"

        },

        {

            title: "Đã ẩn",

            value: hiddenService,

            color: "#dc2626"

        }

    ];

    /* =========================
        PAGINATION
    ========================= */

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filteredServices.length /
                itemsPerPage
            )
        );

    const currentData =
        filteredServices.slice(

            (currentPage - 1) *
            itemsPerPage,

            currentPage *
            itemsPerPage

        );

    const goPage = (page) => {

        if (

            page < 1 ||

            page > totalPages

        ) return;

        setCurrentPage(page);

    };

    /* =========================
        RESET FORM
    ========================= */

    const resetForm = () => {

        setEditing(null);

        setForm({

            TenDV: "",

            GiaDV: "",

            MoTa: "",

            MaCN:
                user.role === "admin"
                    ? ""
                    : user.MaCN

        });

    };

    /* =========================
        OPEN CREATE
    ========================= */

    const openCreate = () => {

        resetForm();

        setShowModal(true);

    };

    /* =========================
        EDIT
    ========================= */

    const handleEdit = (item) => {

        setEditing(item);

        setForm({

            TenDV: item.TenDV,

            GiaDV: item.GiaDV,

            MoTa: item.MoTa,

            MaCN: item.MaCN

        });

        setShowModal(true);

    };

    /* =========================
        SELECT STYLE
    ========================= */

    const selectStyles = {

        control: (base) => ({

            ...base,

            minHeight: 46,

            borderRadius: 12,

            borderColor: "#dbe5ef",

            boxShadow: "none",

            "&:hover": {

                borderColor: "#16b2b2"

            }

        })

    };

    const branchOptions = [

        {

            value: "",

            label: "Tất cả chi nhánh"

        },

        ...branches.map(item => ({

            value: item.MaCN,

            label: item.TenCN

        }))

    ];
    /* =========================
    SUBMIT
========================= */

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            if (editing) {

                await api.put(

                    `/dichvu/${editing.MaDV}`,

                    form

                );

                alert("Cập nhật dịch vụ thành công");

            }

            else {

                await api.post(

                    "/dichvu",

                    form

                );

                alert("Thêm dịch vụ thành công");

            }

            setShowModal(false);

            resetForm();

            loadServices();

        }

        catch (err) {

            alert(

                err.response?.data?.message ||

                "Có lỗi xảy ra"

            );

        }

    };

    /* =========================
        HIDE
    ========================= */

    const handleHide = async (MaDV) => {

        if (

            !window.confirm(

                "Ẩn dịch vụ này?"

            )

        ) return;

        try {

            await api.put(

                `/dichvu/${MaDV}/hide`

            );

            loadServices();

        }

        catch (err) {

            console.log(err);

        }

    };

    /* =========================
        SHOW
    ========================= */

    const handleShow = async (MaDV) => {

        try {

            await api.put(

                `/dichvu/${MaDV}/show`

            );

            loadServices();

        }

        catch (err) {

            console.log(err);

        }

    };

    if (loading)

        return <h3>Đang tải...</h3>;

    return (

        <div className="dichvu-page">

            <div className="dichvu-card">

                <div className="dichvu-header">

                    <h2 className="dichvu-title">

                        Quản lý dịch vụ

                    </h2>

                    <button

                        className="btn-add"

                        onClick={openCreate}

                    >

                        + Thêm dịch vụ

                    </button>

                </div>

                <div className="statistic-grid">

                    {statistic.map(item => (

                        <div

                            key={item.title}

                            className="statistic-card"

                        >

                            <h4>

                                {item.title}

                            </h4>

                            <h2

                                style={{

                                    color: item.color

                                }}

                            >

                                {item.value}

                            </h2>

                        </div>

                    ))}

                </div>

                <div className="toolbar">

                    <div className="toolbar-left">

                        <input

                            className="search-box"

                            placeholder="Tìm dịch vụ..."

                            value={search}

                            onChange={(e) =>

                                setSearch(

                                    e.target.value

                                )

                            }

                        />

                        {

                            user.role === "admin" && (

                                <Select

                                    className="branch-select"

                                    styles={selectStyles}

                                    options={branchOptions}

                                    value={

                                        branchOptions.find(

                                            x =>

                                                x.value ===

                                                branchFilter

                                        )

                                    }

                                    onChange={(option) =>

                                        setBranchFilter(

                                            option.value

                                        )

                                    }

                                />

                            )

                        }

                    </div>

                </div>

                <div className="table-wrapper">

                    <table>

                        <thead>

                            <tr>

                                <th>Mã DV</th>

                                <th>Tên dịch vụ</th>

                                <th>Giá</th>

                                <th>Chi nhánh</th>

                                <th>Trạng thái</th>

                                <th>Hành động</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                currentData.length === 0 ?

                                    (

                                        <tr>

                                            <td

                                                colSpan="6"

                                            >

                                                Không có dữ liệu

                                            </td>

                                        </tr>

                                    )

                                    :

                                    currentData.map(item => (

                                        <tr

                                            key={item.MaDV}

                                        >

                                            <td>

                                                {item.MaDV}

                                            </td>

                                            <td>

                                                {item.TenDV}

                                            </td>

                                            <td>

                                                {

                                                    Number(

                                                        item.GiaDV

                                                    ).toLocaleString()

                                                } VNĐ

                                            </td>

                                            <td>

                                                {item.MaCN}

                                            </td>

                                            <td>

                                                {

                                                    Number(item.TrangThai) === 1 ?

                                                        (

                                                            <span className="badge-active">

                                                                Đang hoạt động

                                                            </span>

                                                        )

                                                        :

                                                        (

                                                            <span className="badge-hide">

                                                                Đã ẩn

                                                            </span>

                                                        )

                                                }

                                            </td>

                                            <td>

                                                <div className="action-group">

                                                    <button

                                                        className="btn-edit"

                                                        onClick={() =>

                                                            handleEdit(item)

                                                        }

                                                    >

                                                        Sửa

                                                    </button>

                                                    {

                                                        Number(item.TrangThai) === 1 ?

                                                            (

                                                                <button

                                                                    className="btn-hide"

                                                                    onClick={() =>

                                                                        handleHide(

                                                                            item.MaDV

                                                                        )

                                                                    }

                                                                >

                                                                    Ẩn

                                                                </button>

                                                            )

                                                            :

                                                            (

                                                                <button

                                                                    className="btn-show"

                                                                    onClick={() =>

                                                                        handleShow(

                                                                            item.MaDV

                                                                        )

                                                                    }

                                                                >

                                                                    Hiện

                                                                </button>

                                                            )

                                                    }

                                                </div>

                                            </td>

                                        </tr>

                                    ))

                            }

                        </tbody>

                    </table>

                </div>

                <div className="pagination">

                    <button

                        onClick={() =>

                            goPage(

                                currentPage - 1

                            )

                        }

                    >

                        ←

                    </button>

                    <span>

                        {currentPage}

                        {" / "}
                        {totalPages}

                    </span>

                    <button

                        onClick={() =>

                            goPage(

                                currentPage + 1

                            )

                        }

                    >

                        →

                    </button>

                </div>

            </div>
            {/* ================= MODAL ================= */}

            {showModal && (

                <div className="modal-overlay">

                    <div className="modal-box">

                        <h3>

                            {

                                editing

                                    ? "Cập nhật dịch vụ"

                                    : "Thêm dịch vụ"

                            }

                        </h3>

                        <form

                            onSubmit={handleSubmit}

                        >

                            <div className="form-group">

                                <label>

                                    Tên dịch vụ

                                </label>

                                <input

                                    type="text"

                                    placeholder="Nhập tên dịch vụ"

                                    value={form.TenDV}

                                    onChange={(e) =>

                                        setForm({

                                            ...form,

                                            TenDV: e.target.value

                                        })

                                    }

                                    required

                                />

                            </div>

                            <div className="form-group">

                                <label>

                                    Giá dịch vụ

                                </label>

                                <input

                                    type="number"

                                    placeholder="Nhập giá"

                                    value={form.GiaDV}

                                    onChange={(e) =>

                                        setForm({

                                            ...form,

                                            GiaDV: e.target.value

                                        })

                                    }

                                    required

                                />

                            </div>

                            <div className="form-group">

                                <label>

                                    Mô tả

                                </label>

                                <textarea

                                    rows={4}

                                    placeholder="Nhập mô tả"

                                    value={form.MoTa}

                                    onChange={(e) =>

                                        setForm({

                                            ...form,

                                            MoTa: e.target.value

                                        })

                                    }

                                />

                            </div>

                            {

                                user.role === "admin" && (

                                    <div className="form-group">

                                        <label>

                                            Chi nhánh

                                        </label>

                                        <Select

                                            styles={selectStyles}

                                            options={

                                                branches.map(

                                                    item => ({

                                                        value: item.MaCN,

                                                        label: item.TenCN

                                                    })

                                                )

                                            }

                                            value={

                                                branches

                                                    .map(item => ({

                                                        value: item.MaCN,

                                                        label: item.TenCN

                                                    }))

                                                    .find(

                                                        x =>

                                                            x.value ===

                                                            form.MaCN

                                                    )

                                            }

                                            onChange={(option) =>

                                                setForm({

                                                    ...form,

                                                    MaCN:

                                                        option.value

                                                })

                                            }

                                        />

                                    </div>

                                )

                            }

                            <div className="modal-action">

                                <button

                                    type="button"

                                    className="btn-cancel"

                                    onClick={() => {

                                        setShowModal(false);

                                        resetForm();

                                    }}

                                >

                                    Hủy

                                </button>

                                <button

                                    type="submit"

                                    className="btn-save"

                                >

                                    {

                                        editing

                                            ? "Cập nhật"

                                            : "Thêm mới"

                                    }

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>

    );

}