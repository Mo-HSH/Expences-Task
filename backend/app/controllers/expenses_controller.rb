# frozen_string_literal: true

class ExpensesController < ApplicationController
  before_action :set_expense, except: %i[index create]
  before_action :set_account, :validate_balance, only: %i[create update]

  def index
    @expenses = Expense.all.includes(:account).order(date: :desc)
  end

  def show; end

  def create
    @expense = Expense.create!(expense_params)

    render status: :created
  end

  def update
    @expense.update!(expense_params)
  end

  def destroy
    @expense.destroy!

    render json: { status: :ok }
  end

  private

  def set_expense
    @expense = Expense.find(params[:id])
  end

  def set_account
    @account = Account.find(params[:account_id])
  end

  def validate_balance
    render_error('amount can not be bigger than balance', :unprocessable_entity) if expense_params['amount'].to_i > @account.balance.to_i
  end

  def expense_params
    params.require(:expense).permit(:account_id, :amount, :date, :description)
  end
end
