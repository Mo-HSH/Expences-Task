# frozen_string_literal: true

class Expense < ApplicationRecord
  belongs_to :account, optional: false
  after_commit :recalculate_balance_watch

  validates :amount, :date, :description, presence: true
  validates :amount, numericality: { greater_than: 0, only_integer: true }

  def recalculate_balance_watch
    account.recalculate_balance!
  end

  def account_name
    account&.name
  end
end
