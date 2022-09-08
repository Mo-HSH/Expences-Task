# frozen_string_literal: true

class Account < ApplicationRecord
  has_many :expenses, dependent: :destroy

  before_create :init_balance
  validates :balance, numericality: { greater_than: 0 }

  def init_balance
    self.balance = 1_000
  end

  def recalculate_balance!
    update!(balance: 1_000 - expenses.sum(:amount))
  end

  def balance_amount
    balance.to_i
  end
end
