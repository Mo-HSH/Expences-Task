import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import LoadingIndicator from "./LoadingIndicator";
import ErrorMessage from "./ErrorMessage";
import request from "../request";
import styles from "./ExpenseEdit.module.css";
import Button from "./Button";
import { useNotifications } from "./Notifications";

function ExpenseForm({ expense, onSave, disabled, onDelete }) {
    const [changes, setChanges] = useState({});
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(function () {
        async function loadAccounts() {
            const response = await request("/accounts", {
                method: "GET",
            });
            if (response.ok) {
                setAccounts(response.body);
                setLoading(false);
            }
        }

        loadAccounts();
    }, []);

    function changeField(field, value) {
        setChanges({
            ...changes,
            [field]: value,
        });
    }

    const formData = {
        ...expense,
        ...changes,
    };

    function handleSubmit(event) {
        event.preventDefault();
        onSave(changes);
    }

    return (
        <>
            { !loading &&
            <form autoComplete={"off"} onSubmit={handleSubmit} className={styles.form}>
                <fieldset disabled={disabled ? "disabled" : undefined}>
                    <div className={styles.formRow}>
                        <label htmlFor="account_id">Account</label>
                        <select
                            required
                            id={"account_id"}
                            onChange={(event) => changeField("account_id", event.target.value)}
                        >
                            <option value=''></option>
                            {accounts['accounts'].map(({ id, name }, index) => <option key={index} value={id} >{name}</option>)}
                        </select>
                    </div>
                    <div className={styles.formRow}>
                        <label htmlFor="amount">Amount</label>
                        <input
                            required
                            min={"0"}
                            id={"amount"}
                            type={"number"}
                            value={formData.amount}
                            onChange={(event) => changeField("amount", event.target.value)}
                        />
                    </div>

                    <div className={styles.formRow}>
                        <label htmlFor="date">Date</label>
                        <input
                            required
                            id={"date"}
                            type={"date"}
                            value={formData.date}
                            onChange={(event) => changeField("date", event.target.value)}
                        />
                    </div>

                    <div className={styles.formRow}>
                        <label htmlFor="description">Description</label>
                        <input
                            required
                            id={"description"}
                            type={"text"}
                            value={formData.description}
                            onChange={(event) => changeField("description", event.target.value)}
                        />
                    </div>
                </fieldset>

                <div className={styles.formFooter}>
                    {expense.id && (
                        <Button action={onDelete} kind={"danger"} disabled={disabled}>
                            Delete
                        </Button>
                    )}
                    <Button
                        type={"submit"}
                        disabled={Object.keys(changes).length === 0 || disabled}
                    >
                        Save
                    </Button>
                </div>
            </form>
            }
        </>
    );
}

const defaultExpenseData = {
    account_id: null,
    amount: 0,
    date: new Date().toISOString().substr(0, 10),
    description: ""
};

function ExpenseEdit() {
    const { id } = useParams();
    const history = useHistory();
    const [expense, setExpense] = useState(id ? null : defaultExpenseData);
    const [loadingStatus, setLoadingStatus] = useState(id ? "loading" : "loaded");
    const [isSaving, setSaving] = useState(false);
    const [isDeleting, setDeleting] = useState(false);
    const { notifyError } = useNotifications();

    useEffect(
        function () {
            async function loadExpense() {
                try {
                    const response = await request(`/expenses/${id}`, {
                        method: "GET",
                    });
                    if (response.ok) {
                        setExpense(response.body['expense']);
                        setLoadingStatus("loaded");
                    } else {
                        setLoadingStatus("error");
                    }
                } catch (error) {
                    setLoadingStatus("error");
                }
            }

            if (id) {
                loadExpense();
            }
        },
        [id]
    );

    async function handleSave(changes) {
        try {
            setSaving(true);
            const url = expense.id ? `/expenses/${expense.id}` : "/expenses";
            const method = expense.id ? "PATCH" : "POST";
            const body = expense.id ? changes : { ...defaultExpenseData, ...changes };
            const response = await request(url, {
                method,
                body,
            });
            if (response.ok) {
                setExpense(response.body);
                history.push("/expenses");
            } else {
                notifyError(response.body.error_message);
            }
        } catch (error) {
            notifyError(
                "Failed to save expense. Please check your internet connection"
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        setDeleting(true);
        try {
            const response = await request(`/expenses/${expense.id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                history.push("/expenses");
            } else {
                notifyError("Failed to delete expense. Please try again");
            }
        } catch (error) {
            notifyError(
                "Failed to delete expense. Please check your internet connection"
            );
        } finally {
            setDeleting(false);
        }
    }

    let content;
    if (loadingStatus === "loading") {
        content = <LoadingIndicator />;
    } else if (loadingStatus === "loaded") {
        content = (
            <ExpenseForm
                key={expense.updated_at}
                expense={expense}
                onSave={handleSave}
                disabled={isSaving || isDeleting}
                onDelete={handleDelete}
            />
        );
    } else if (loadingStatus === "error") {
        content = <ErrorMessage />;
    } else {
        throw new Error(`Unexpected loadingStatus: ${loadingStatus}`);
    }

    return <div>{content}</div>;
}

export default ExpenseEdit;
