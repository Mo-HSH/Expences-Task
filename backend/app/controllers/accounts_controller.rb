# frozen_string_literal: true

class AccountsController < ApplicationController
  before_action :set_account, except: %i[index create]

  def index
    @accounts = Account.order(id: :desc)
  end

  def show; end

  def create
    @account = Account.create!(account_params)

    render status: :created
  end

  def update
    @account.update!(account_params)
  end

  def destroy
    @account.destroy!

    render json: { status: :ok }
  end

  private

  def set_account
    @account = Account.find(params[:id])
  end

  def account_params
    params.require(:account).permit(:name, :number)
  end
end
