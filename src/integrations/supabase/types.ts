export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      additional_services: {
        Row: {
          category: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          is_taxable: boolean
          price: number
          pricing_type: string
          service_name: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_taxable?: boolean
          price: number
          pricing_type?: string
          service_name: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_taxable?: boolean
          price?: number
          pricing_type?: string
          service_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      bonds: {
        Row: {
          bond_amount: number
          bond_number: string
          bond_type: string
          booking_id: string
          claim_reason: string | null
          claimed_at: string | null
          contract_id: string | null
          created_at: string
          created_by: string | null
          customer_id: string
          held_at: string | null
          id: string
          released_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          bond_amount: number
          bond_number: string
          bond_type?: string
          booking_id: string
          claim_reason?: string | null
          claimed_at?: string | null
          contract_id?: string | null
          created_at?: string
          created_by?: string | null
          customer_id: string
          held_at?: string | null
          id?: string
          released_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          bond_amount?: number
          bond_number?: string
          bond_type?: string
          booking_id?: string
          claim_reason?: string | null
          claimed_at?: string | null
          contract_id?: string | null
          created_at?: string
          created_by?: string | null
          customer_id?: string
          held_at?: string | null
          id?: string
          released_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          created_at: string
          created_by: string | null
          customer_id: string
          deposit_amount: number | null
          discount_amount: number | null
          end_date: string
          end_time: string | null
          id: string
          original_amount: number | null
          paid_amount: number | null
          payment_status: string | null
          promotion_id: string | null
          special_requests: string | null
          start_date: string
          start_time: string | null
          status: Database["public"]["Enums"]["booking_status"]
          stripe_session_id: string | null
          total_amount: number
          updated_at: string
          yacht_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          customer_id: string
          deposit_amount?: number | null
          discount_amount?: number | null
          end_date: string
          end_time?: string | null
          id?: string
          original_amount?: number | null
          paid_amount?: number | null
          payment_status?: string | null
          promotion_id?: string | null
          special_requests?: string | null
          start_date: string
          start_time?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          stripe_session_id?: string | null
          total_amount: number
          updated_at?: string
          yacht_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          customer_id?: string
          deposit_amount?: number | null
          discount_amount?: number | null
          end_date?: string
          end_time?: string | null
          id?: string
          original_amount?: number | null
          paid_amount?: number | null
          payment_status?: string | null
          promotion_id?: string | null
          special_requests?: string | null
          start_date?: string
          start_time?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          stripe_session_id?: string | null
          total_amount?: number
          updated_at?: string
          yacht_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "promotions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_yacht_id_fkey"
            columns: ["yacht_id"]
            isOneToOne: false
            referencedRelation: "yachts"
            referencedColumns: ["id"]
          },
        ]
      }
      chart_of_accounts: {
        Row: {
          account_name: string
          account_number: string
          account_type: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          parent_account_id: string | null
          updated_at: string
        }
        Insert: {
          account_name: string
          account_number: string
          account_type: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          parent_account_id?: string | null
          updated_at?: string
        }
        Update: {
          account_name?: string
          account_number?: string
          account_type?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          parent_account_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chart_of_accounts_parent_account_id_fkey"
            columns: ["parent_account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      closing_periods: {
        Row: {
          closed_at: string | null
          closed_by: string | null
          created_at: string
          created_by: string | null
          end_date: string
          fiscal_year: number
          id: string
          period_name: string
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          closed_at?: string | null
          closed_by?: string | null
          created_at?: string
          created_by?: string | null
          end_date: string
          fiscal_year: number
          id?: string
          period_name: string
          start_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          closed_at?: string | null
          closed_by?: string | null
          created_at?: string
          created_by?: string | null
          end_date?: string
          fiscal_year?: number
          id?: string
          period_name?: string
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      contract_templates: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          is_default: boolean
          template_content: string
          template_name: string
          template_variables: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          is_default?: boolean
          template_content: string
          template_name: string
          template_variables?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          is_default?: boolean
          template_content?: string
          template_name?: string
          template_variables?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      contracts: {
        Row: {
          booking_id: string
          contract_content: string
          contract_number: string
          created_at: string
          created_by: string | null
          customer_id: string
          digital_signature: string | null
          id: string
          signed_at: string | null
          signed_by_customer: boolean
          status: string
          template_id: string | null
          terms_and_conditions: string | null
          updated_at: string
        }
        Insert: {
          booking_id: string
          contract_content: string
          contract_number: string
          created_at?: string
          created_by?: string | null
          customer_id: string
          digital_signature?: string | null
          id?: string
          signed_at?: string | null
          signed_by_customer?: boolean
          status?: string
          template_id?: string | null
          terms_and_conditions?: string | null
          updated_at?: string
        }
        Update: {
          booking_id?: string
          contract_content?: string
          contract_number?: string
          created_at?: string
          created_by?: string | null
          customer_id?: string
          digital_signature?: string | null
          id?: string
          signed_at?: string | null
          signed_by_customer?: boolean
          status?: string
          template_id?: string | null
          terms_and_conditions?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracts_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      cost_centers: {
        Row: {
          center_code: string
          center_name: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          parent_center_id: string | null
          updated_at: string
        }
        Insert: {
          center_code: string
          center_name: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          parent_center_id?: string | null
          updated_at?: string
        }
        Update: {
          center_code?: string
          center_name?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          parent_center_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cost_centers_parent_center_id_fkey"
            columns: ["parent_center_id"]
            isOneToOne: false
            referencedRelation: "cost_centers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          created_at: string
          email: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          first_name: string
          id: string
          last_name: string
          notes: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name: string
          id?: string
          last_name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string
          id?: string
          last_name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      depreciation_entries: {
        Row: {
          accumulated_depreciation: number
          book_value: number
          created_at: string
          created_by: string | null
          depreciation_schedule_id: string
          entry_date: string
          financial_transaction_id: string | null
          id: string
          monthly_depreciation: number
          status: string
          updated_at: string
        }
        Insert: {
          accumulated_depreciation: number
          book_value: number
          created_at?: string
          created_by?: string | null
          depreciation_schedule_id: string
          entry_date?: string
          financial_transaction_id?: string | null
          id?: string
          monthly_depreciation: number
          status?: string
          updated_at?: string
        }
        Update: {
          accumulated_depreciation?: number
          book_value?: number
          created_at?: string
          created_by?: string | null
          depreciation_schedule_id?: string
          entry_date?: string
          financial_transaction_id?: string | null
          id?: string
          monthly_depreciation?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "depreciation_entries_depreciation_schedule_id_fkey"
            columns: ["depreciation_schedule_id"]
            isOneToOne: false
            referencedRelation: "depreciation_schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "depreciation_entries_financial_transaction_id_fkey"
            columns: ["financial_transaction_id"]
            isOneToOne: false
            referencedRelation: "financial_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      depreciation_schedules: {
        Row: {
          accumulated_depreciation: number | null
          annual_depreciation: number
          asset_code: string
          asset_name: string
          book_value: number
          cost_center_id: string | null
          created_at: string
          created_by: string | null
          depreciation_method: string
          id: string
          purchase_cost: number
          purchase_date: string
          salvage_value: number | null
          status: string
          updated_at: string
          useful_life_years: number
        }
        Insert: {
          accumulated_depreciation?: number | null
          annual_depreciation: number
          asset_code: string
          asset_name: string
          book_value: number
          cost_center_id?: string | null
          created_at?: string
          created_by?: string | null
          depreciation_method?: string
          id?: string
          purchase_cost: number
          purchase_date: string
          salvage_value?: number | null
          status?: string
          updated_at?: string
          useful_life_years: number
        }
        Update: {
          accumulated_depreciation?: number | null
          annual_depreciation?: number
          asset_code?: string
          asset_name?: string
          book_value?: number
          cost_center_id?: string | null
          created_at?: string
          created_by?: string | null
          depreciation_method?: string
          id?: string
          purchase_cost?: number
          purchase_date?: string
          salvage_value?: number | null
          status?: string
          updated_at?: string
          useful_life_years?: number
        }
        Relationships: [
          {
            foreignKeyName: "depreciation_schedules_cost_center_id_fkey"
            columns: ["cost_center_id"]
            isOneToOne: false
            referencedRelation: "cost_centers"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_leaves: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          created_by: string | null
          days_count: number
          employee_id: string
          end_date: string
          id: string
          leave_type: string
          reason: string | null
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          created_by?: string | null
          days_count: number
          employee_id: string
          end_date: string
          id?: string
          leave_type: string
          reason?: string | null
          start_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          created_by?: string | null
          days_count?: number
          employee_id?: string
          end_date?: string
          id?: string
          leave_type?: string
          reason?: string | null
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_leaves_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          bank_account_number: string | null
          bank_name: string | null
          created_at: string
          created_by: string | null
          department: string | null
          email: string | null
          employee_number: string
          first_name: string
          hire_date: string
          id: string
          last_name: string
          phone: string | null
          position: string
          salary_amount: number
          salary_type: string
          status: string
          termination_date: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          bank_account_number?: string | null
          bank_name?: string | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          email?: string | null
          employee_number: string
          first_name: string
          hire_date: string
          id?: string
          last_name: string
          phone?: string | null
          position: string
          salary_amount: number
          salary_type?: string
          status?: string
          termination_date?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          bank_account_number?: string | null
          bank_name?: string | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          email?: string | null
          employee_number?: string
          first_name?: string
          hire_date?: string
          id?: string
          last_name?: string
          phone?: string | null
          position?: string
          salary_amount?: number
          salary_type?: string
          status?: string
          termination_date?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      end_of_service_benefits: {
        Row: {
          basic_salary: number
          benefit_amount: number
          calculation_date: string
          calculation_method: string
          created_at: string
          created_by: string | null
          employee_id: string
          id: string
          notes: string | null
          paid_at: string | null
          status: string
          updated_at: string
          years_of_service: number
        }
        Insert: {
          basic_salary: number
          benefit_amount: number
          calculation_date?: string
          calculation_method?: string
          created_at?: string
          created_by?: string | null
          employee_id: string
          id?: string
          notes?: string | null
          paid_at?: string | null
          status?: string
          updated_at?: string
          years_of_service: number
        }
        Update: {
          basic_salary?: number
          benefit_amount?: number
          calculation_date?: string
          calculation_method?: string
          created_at?: string
          created_by?: string | null
          employee_id?: string
          id?: string
          notes?: string | null
          paid_at?: string | null
          status?: string
          updated_at?: string
          years_of_service?: number
        }
        Relationships: [
          {
            foreignKeyName: "end_of_service_benefits_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          approved_at: string | null
          approved_by: string | null
          category: Database["public"]["Enums"]["expense_category"]
          created_at: string
          created_by: string | null
          description: string
          expense_date: string
          expense_number: string
          id: string
          is_reimbursable: boolean
          receipt_url: string | null
          updated_at: string
          vendor_name: string
          yacht_id: string | null
        }
        Insert: {
          amount: number
          approved_at?: string | null
          approved_by?: string | null
          category: Database["public"]["Enums"]["expense_category"]
          created_at?: string
          created_by?: string | null
          description: string
          expense_date?: string
          expense_number: string
          id?: string
          is_reimbursable?: boolean
          receipt_url?: string | null
          updated_at?: string
          vendor_name: string
          yacht_id?: string | null
        }
        Update: {
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          category?: Database["public"]["Enums"]["expense_category"]
          created_at?: string
          created_by?: string | null
          description?: string
          expense_date?: string
          expense_number?: string
          id?: string
          is_reimbursable?: boolean
          receipt_url?: string | null
          updated_at?: string
          vendor_name?: string
          yacht_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_yacht_id_fkey"
            columns: ["yacht_id"]
            isOneToOne: false
            referencedRelation: "yachts"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_transactions: {
        Row: {
          account_id: string | null
          amount: number
          created_at: string
          created_by: string | null
          description: string
          expense_id: string | null
          id: string
          invoice_id: string | null
          payment_id: string | null
          transaction_date: string
          transaction_number: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string
        }
        Insert: {
          account_id?: string | null
          amount: number
          created_at?: string
          created_by?: string | null
          description: string
          expense_id?: string | null
          id?: string
          invoice_id?: string | null
          payment_id?: string | null
          transaction_date?: string
          transaction_number: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
        }
        Update: {
          account_id?: string | null
          amount?: number
          created_at?: string
          created_by?: string | null
          description?: string
          expense_id?: string | null
          id?: string
          invoice_id?: string | null
          payment_id?: string | null
          transaction_date?: string
          transaction_number?: string
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_expense_id_fkey"
            columns: ["expense_id"]
            isOneToOne: false
            referencedRelation: "expenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_adjustment_items: {
        Row: {
          adjusted_quantity: number
          adjustment_id: string
          adjustment_value: number
          created_at: string
          current_quantity: number
          id: string
          item_id: string
          quantity_difference: number
          reason: string | null
          unit_cost: number
        }
        Insert: {
          adjusted_quantity: number
          adjustment_id: string
          adjustment_value: number
          created_at?: string
          current_quantity: number
          id?: string
          item_id: string
          quantity_difference: number
          reason?: string | null
          unit_cost: number
        }
        Update: {
          adjusted_quantity?: number
          adjustment_id?: string
          adjustment_value?: number
          created_at?: string
          current_quantity?: number
          id?: string
          item_id?: string
          quantity_difference?: number
          reason?: string | null
          unit_cost?: number
        }
        Relationships: [
          {
            foreignKeyName: "inventory_adjustment_items_adjustment_id_fkey"
            columns: ["adjustment_id"]
            isOneToOne: false
            referencedRelation: "inventory_adjustments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_adjustment_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_adjustments: {
        Row: {
          adjustment_date: string
          adjustment_number: string
          approved_at: string | null
          approved_by: string | null
          created_at: string
          created_by: string | null
          id: string
          reason: string
          reference_document: string | null
          status: string
          total_adjustment_value: number
          updated_at: string
        }
        Insert: {
          adjustment_date?: string
          adjustment_number: string
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          reason: string
          reference_document?: string | null
          status?: string
          total_adjustment_value?: number
          updated_at?: string
        }
        Update: {
          adjustment_date?: string
          adjustment_number?: string
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          reason?: string
          reference_document?: string | null
          status?: string
          total_adjustment_value?: number
          updated_at?: string
        }
        Relationships: []
      }
      inventory_categories: {
        Row: {
          category_name: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          parent_category_id: string | null
          updated_at: string
        }
        Insert: {
          category_name: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          parent_category_id?: string | null
          updated_at?: string
        }
        Update: {
          category_name?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          parent_category_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_categories_parent_category_id_fkey"
            columns: ["parent_category_id"]
            isOneToOne: false
            referencedRelation: "inventory_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_items: {
        Row: {
          barcode: string | null
          category_id: string | null
          cost_price: number
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          is_serialized: boolean
          item_code: string
          item_name: string
          location: string | null
          max_stock_level: number | null
          reorder_level: number | null
          selling_price: number
          supplier_info: Json | null
          unit_of_measure: string
          updated_at: string
        }
        Insert: {
          barcode?: string | null
          category_id?: string | null
          cost_price?: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_serialized?: boolean
          item_code: string
          item_name: string
          location?: string | null
          max_stock_level?: number | null
          reorder_level?: number | null
          selling_price?: number
          supplier_info?: Json | null
          unit_of_measure?: string
          updated_at?: string
        }
        Update: {
          barcode?: string | null
          category_id?: string | null
          cost_price?: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_serialized?: boolean
          item_code?: string
          item_name?: string
          location?: string | null
          max_stock_level?: number | null
          reorder_level?: number | null
          selling_price?: number
          supplier_info?: Json | null
          unit_of_measure?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "inventory_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_movements: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          item_id: string
          location_from: string | null
          location_to: string | null
          movement_date: string
          movement_number: string
          movement_type: string
          notes: string | null
          quantity: number
          reason: string | null
          reference_id: string | null
          reference_type: string | null
          total_cost: number | null
          unit_cost: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          item_id: string
          location_from?: string | null
          location_to?: string | null
          movement_date?: string
          movement_number: string
          movement_type: string
          notes?: string | null
          quantity: number
          reason?: string | null
          reference_id?: string | null
          reference_type?: string | null
          total_cost?: number | null
          unit_cost?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          item_id?: string
          location_from?: string | null
          location_to?: string | null
          movement_date?: string
          movement_number?: string
          movement_type?: string
          notes?: string | null
          quantity?: number
          reason?: string | null
          reference_id?: string | null
          reference_type?: string | null
          total_cost?: number | null
          unit_cost?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_stock: {
        Row: {
          average_cost: number
          id: string
          item_id: string
          last_movement_date: string | null
          location: string | null
          quantity_available: number
          quantity_on_hand: number
          quantity_reserved: number
          total_value: number
          updated_at: string
        }
        Insert: {
          average_cost?: number
          id?: string
          item_id: string
          last_movement_date?: string | null
          location?: string | null
          quantity_available?: number
          quantity_on_hand?: number
          quantity_reserved?: number
          total_value?: number
          updated_at?: string
        }
        Update: {
          average_cost?: number
          id?: string
          item_id?: string
          last_movement_date?: string | null
          location?: string | null
          quantity_available?: number
          quantity_on_hand?: number
          quantity_reserved?: number
          total_value?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_stock_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_line_items: {
        Row: {
          created_at: string
          description: string
          id: string
          invoice_id: string
          line_total: number
          quantity: number
          unit_price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          invoice_id: string
          line_total?: number
          quantity?: number
          unit_price?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          invoice_id?: string
          line_total?: number
          quantity?: number
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_line_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          balance_due: number
          booking_id: string | null
          created_at: string
          created_by: string | null
          customer_id: string
          due_date: string
          id: string
          invoice_number: string
          issue_date: string
          notes: string | null
          paid_amount: number
          status: Database["public"]["Enums"]["invoice_status"]
          subtotal: number
          tax_amount: number
          terms_and_conditions: string | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          balance_due?: number
          booking_id?: string | null
          created_at?: string
          created_by?: string | null
          customer_id: string
          due_date: string
          id?: string
          invoice_number: string
          issue_date?: string
          notes?: string | null
          paid_amount?: number
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal?: number
          tax_amount?: number
          terms_and_conditions?: string | null
          total_amount?: number
          updated_at?: string
        }
        Update: {
          balance_due?: number
          booking_id?: string | null
          created_at?: string
          created_by?: string | null
          customer_id?: string
          due_date?: string
          id?: string
          invoice_number?: string
          issue_date?: string
          notes?: string | null
          paid_amount?: number
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal?: number
          tax_amount?: number
          terms_and_conditions?: string | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      journal_entries: {
        Row: {
          created_at: string
          created_by: string | null
          description: string
          entry_date: string
          entry_number: string
          entry_type: string
          id: string
          posted_by: string | null
          posting_date: string | null
          reference_number: string | null
          reversal_reason: string | null
          reversed_at: string | null
          reversed_by: string | null
          source_document_id: string | null
          source_document_type: string | null
          status: string
          total_credit: number
          total_debit: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description: string
          entry_date?: string
          entry_number: string
          entry_type?: string
          id?: string
          posted_by?: string | null
          posting_date?: string | null
          reference_number?: string | null
          reversal_reason?: string | null
          reversed_at?: string | null
          reversed_by?: string | null
          source_document_id?: string | null
          source_document_type?: string | null
          status?: string
          total_credit?: number
          total_debit?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string
          entry_date?: string
          entry_number?: string
          entry_type?: string
          id?: string
          posted_by?: string | null
          posting_date?: string | null
          reference_number?: string | null
          reversal_reason?: string | null
          reversed_at?: string | null
          reversed_by?: string | null
          source_document_id?: string | null
          source_document_type?: string | null
          status?: string
          total_credit?: number
          total_debit?: number
          updated_at?: string
        }
        Relationships: []
      }
      journal_entry_lines: {
        Row: {
          account_id: string
          created_at: string
          credit_amount: number | null
          debit_amount: number | null
          description: string | null
          id: string
          journal_entry_id: string
          line_order: number
          updated_at: string
        }
        Insert: {
          account_id: string
          created_at?: string
          credit_amount?: number | null
          debit_amount?: number | null
          description?: string | null
          id?: string
          journal_entry_id: string
          line_order?: number
          updated_at?: string
        }
        Update: {
          account_id?: string
          created_at?: string
          credit_amount?: number | null
          debit_amount?: number | null
          description?: string | null
          id?: string
          journal_entry_id?: string
          line_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "journal_entry_lines_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journal_entry_lines_journal_entry_id_fkey"
            columns: ["journal_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string
          customer_id: string
          id: string
          invoice_id: string | null
          notes: string | null
          payment_date: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_number: string
          processed_by: string | null
          reference_number: string | null
          status: Database["public"]["Enums"]["payment_status"]
          updated_at: string
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string
          customer_id: string
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_date?: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_number: string
          processed_by?: string | null
          reference_number?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_date?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_number?: string
          processed_by?: string | null
          reference_number?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll: {
        Row: {
          allowances: number | null
          approved_by: string | null
          basic_salary: number
          created_at: string
          created_by: string | null
          deductions: number | null
          employee_id: string
          gross_pay: number
          id: string
          net_pay: number
          overtime_amount: number | null
          overtime_hours: number | null
          overtime_rate: number | null
          paid_at: string | null
          pay_period_end: string
          pay_period_start: string
          payroll_number: string
          social_security: number | null
          status: string
          tax_amount: number | null
          updated_at: string
        }
        Insert: {
          allowances?: number | null
          approved_by?: string | null
          basic_salary: number
          created_at?: string
          created_by?: string | null
          deductions?: number | null
          employee_id: string
          gross_pay: number
          id?: string
          net_pay: number
          overtime_amount?: number | null
          overtime_hours?: number | null
          overtime_rate?: number | null
          paid_at?: string | null
          pay_period_end: string
          pay_period_start: string
          payroll_number: string
          social_security?: number | null
          status?: string
          tax_amount?: number | null
          updated_at?: string
        }
        Update: {
          allowances?: number | null
          approved_by?: string | null
          basic_salary?: number
          created_at?: string
          created_by?: string | null
          deductions?: number | null
          employee_id?: string
          gross_pay?: number
          id?: string
          net_pay?: number
          overtime_amount?: number | null
          overtime_hours?: number | null
          overtime_rate?: number | null
          paid_at?: string | null
          pay_period_end?: string
          pay_period_start?: string
          payroll_number?: string
          social_security?: number | null
          status?: string
          tax_amount?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      pricing_tiers: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          discount_percentage: number | null
          id: string
          is_active: boolean
          minimum_booking_days: number | null
          tier_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          discount_percentage?: number | null
          id?: string
          is_active?: boolean
          minimum_booking_days?: number | null
          tier_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          discount_percentage?: number | null
          id?: string
          is_active?: boolean
          minimum_booking_days?: number | null
          tier_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      promotion_usage: {
        Row: {
          booking_id: string | null
          customer_id: string | null
          discount_amount: number
          id: string
          promotion_id: string | null
          used_at: string
        }
        Insert: {
          booking_id?: string | null
          customer_id?: string | null
          discount_amount: number
          id?: string
          promotion_id?: string | null
          used_at?: string
        }
        Update: {
          booking_id?: string | null
          customer_id?: string | null
          discount_amount?: number
          id?: string
          promotion_id?: string | null
          used_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "promotion_usage_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotion_usage_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotion_usage_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "promotions"
            referencedColumns: ["id"]
          },
        ]
      }
      promotions: {
        Row: {
          applicable_yacht_ids: string[] | null
          created_at: string
          created_by: string | null
          description: string | null
          discount_type: string
          discount_value: number
          id: string
          is_active: boolean | null
          maximum_discount_amount: number | null
          minimum_booking_amount: number | null
          promotion_code: string
          promotion_name: string
          updated_at: string
          usage_limit: number | null
          used_count: number | null
          valid_from: string
          valid_until: string
        }
        Insert: {
          applicable_yacht_ids?: string[] | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          discount_type: string
          discount_value: number
          id?: string
          is_active?: boolean | null
          maximum_discount_amount?: number | null
          minimum_booking_amount?: number | null
          promotion_code: string
          promotion_name: string
          updated_at?: string
          usage_limit?: number | null
          used_count?: number | null
          valid_from: string
          valid_until: string
        }
        Update: {
          applicable_yacht_ids?: string[] | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          discount_type?: string
          discount_value?: number
          id?: string
          is_active?: boolean | null
          maximum_discount_amount?: number | null
          minimum_booking_amount?: number | null
          promotion_code?: string
          promotion_name?: string
          updated_at?: string
          usage_limit?: number | null
          used_count?: number | null
          valid_from?: string
          valid_until?: string
        }
        Relationships: []
      }
      provisions: {
        Row: {
          account_id: string | null
          amount: number
          calculation_date: string
          created_at: string
          created_by: string | null
          description: string
          id: string
          notes: string | null
          provision_number: string
          provision_type: string
          related_asset_id: string | null
          related_employee_id: string | null
          reversal_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          account_id?: string | null
          amount: number
          calculation_date?: string
          created_at?: string
          created_by?: string | null
          description: string
          id?: string
          notes?: string | null
          provision_number: string
          provision_type: string
          related_asset_id?: string | null
          related_employee_id?: string | null
          reversal_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          account_id?: string | null
          amount?: number
          calculation_date?: string
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          notes?: string | null
          provision_number?: string
          provision_type?: string
          related_asset_id?: string | null
          related_employee_id?: string | null
          reversal_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "provisions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provisions_related_asset_id_fkey"
            columns: ["related_asset_id"]
            isOneToOne: false
            referencedRelation: "depreciation_schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provisions_related_employee_id_fkey"
            columns: ["related_employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_order_items: {
        Row: {
          created_at: string
          id: string
          item_id: string
          line_total: number
          purchase_order_id: string
          quantity_ordered: number
          quantity_received: number
          unit_price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          line_total: number
          purchase_order_id: string
          quantity_ordered: number
          quantity_received?: number
          unit_price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          line_total?: number
          purchase_order_id?: string
          quantity_ordered?: number
          quantity_received?: number
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_order_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_items_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          cost_center_id: string | null
          created_at: string
          created_by: string | null
          expected_delivery_date: string | null
          id: string
          notes: string | null
          order_date: string
          po_number: string
          received_amount: number | null
          received_by: string | null
          received_date: string | null
          status: string
          subtotal: number
          supplier_contact: string | null
          supplier_name: string
          tax_amount: number
          total_amount: number
          updated_at: string
        }
        Insert: {
          cost_center_id?: string | null
          created_at?: string
          created_by?: string | null
          expected_delivery_date?: string | null
          id?: string
          notes?: string | null
          order_date?: string
          po_number: string
          received_amount?: number | null
          received_by?: string | null
          received_date?: string | null
          status?: string
          subtotal?: number
          supplier_contact?: string | null
          supplier_name: string
          tax_amount?: number
          total_amount?: number
          updated_at?: string
        }
        Update: {
          cost_center_id?: string | null
          created_at?: string
          created_by?: string | null
          expected_delivery_date?: string | null
          id?: string
          notes?: string | null
          order_date?: string
          po_number?: string
          received_amount?: number | null
          received_by?: string | null
          received_date?: string | null
          status?: string
          subtotal?: number
          supplier_contact?: string | null
          supplier_name?: string
          tax_amount?: number
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_cost_center_id_fkey"
            columns: ["cost_center_id"]
            isOneToOne: false
            referencedRelation: "cost_centers"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          booking_id: string | null
          comment: string | null
          created_at: string
          customer_id: string | null
          helpful_count: number | null
          id: string
          is_verified: boolean | null
          rating: number
          review_date: string
          title: string | null
          updated_at: string
          yacht_id: string | null
        }
        Insert: {
          booking_id?: string | null
          comment?: string | null
          created_at?: string
          customer_id?: string | null
          helpful_count?: number | null
          id?: string
          is_verified?: boolean | null
          rating: number
          review_date?: string
          title?: string | null
          updated_at?: string
          yacht_id?: string | null
        }
        Update: {
          booking_id?: string | null
          comment?: string | null
          created_at?: string
          customer_id?: string | null
          helpful_count?: number | null
          id?: string
          is_verified?: boolean | null
          rating?: number
          review_date?: string
          title?: string | null
          updated_at?: string
          yacht_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_yacht_id_fkey"
            columns: ["yacht_id"]
            isOneToOne: false
            referencedRelation: "yachts"
            referencedColumns: ["id"]
          },
        ]
      }
      seasonal_pricing: {
        Row: {
          created_at: string
          created_by: string | null
          end_date: string
          id: string
          is_active: boolean
          price_multiplier: number
          season_name: string
          start_date: string
          updated_at: string
          yacht_id: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          end_date: string
          id?: string
          is_active?: boolean
          price_multiplier?: number
          season_name: string
          start_date: string
          updated_at?: string
          yacht_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          end_date?: string
          id?: string
          is_active?: boolean
          price_multiplier?: number
          season_name?: string
          start_date?: string
          updated_at?: string
          yacht_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seasonal_pricing_yacht_id_fkey"
            columns: ["yacht_id"]
            isOneToOne: false
            referencedRelation: "yachts"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          setting_key: string
          setting_value: Json
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          setting_key?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          id: string
          preference_key: string
          preference_value: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          preference_key: string
          preference_value: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          preference_key?: string
          preference_value?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_roles_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      yachts: {
        Row: {
          brand: string | null
          capacity: number | null
          created_at: string
          description: string | null
          features: string[] | null
          id: string
          images: string[] | null
          length_feet: number | null
          location: string | null
          model: string | null
          name: string
          price_per_day: number
          status: Database["public"]["Enums"]["yacht_status"]
          updated_at: string
          year: number | null
        }
        Insert: {
          brand?: string | null
          capacity?: number | null
          created_at?: string
          description?: string | null
          features?: string[] | null
          id?: string
          images?: string[] | null
          length_feet?: number | null
          location?: string | null
          model?: string | null
          name: string
          price_per_day: number
          status?: Database["public"]["Enums"]["yacht_status"]
          updated_at?: string
          year?: number | null
        }
        Update: {
          brand?: string | null
          capacity?: number | null
          created_at?: string
          description?: string | null
          features?: string[] | null
          id?: string
          images?: string[] | null
          length_feet?: number | null
          location?: string | null
          model?: string | null
          name?: string
          price_per_day?: number
          status?: Database["public"]["Enums"]["yacht_status"]
          updated_at?: string
          year?: number | null
        }
        Relationships: []
      }
      year_end_entries: {
        Row: {
          amount: number
          closing_period_id: string | null
          created_at: string
          created_by: string | null
          credit_account_id: string | null
          debit_account_id: string | null
          description: string
          entry_number: string
          entry_type: string
          id: string
          posted_at: string | null
          posted_by: string | null
          reference_document: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          closing_period_id?: string | null
          created_at?: string
          created_by?: string | null
          credit_account_id?: string | null
          debit_account_id?: string | null
          description: string
          entry_number: string
          entry_type: string
          id?: string
          posted_at?: string | null
          posted_by?: string | null
          reference_document?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          closing_period_id?: string | null
          created_at?: string
          created_by?: string | null
          credit_account_id?: string | null
          debit_account_id?: string | null
          description?: string
          entry_number?: string
          entry_type?: string
          id?: string
          posted_at?: string | null
          posted_by?: string | null
          reference_document?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "year_end_entries_closing_period_id_fkey"
            columns: ["closing_period_id"]
            isOneToOne: false
            referencedRelation: "closing_periods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "year_end_entries_credit_account_id_fkey"
            columns: ["credit_account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "year_end_entries_debit_account_id_fkey"
            columns: ["debit_account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      apply_promotion: {
        Args: {
          promotion_code_param: string
          booking_amount_param: number
          yacht_id_param?: string
        }
        Returns: Json
      }
      auto_generate_contract_for_booking: {
        Args: { p_booking_id: string }
        Returns: string
      }
      auto_generate_invoice_for_booking: {
        Args: { p_booking_id: string }
        Returns: string
      }
      calculate_end_of_service_benefit: {
        Args: { p_calculation_date?: string; p_employee_id: string }
        Returns: number
      }
      calculate_monthly_depreciation: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      calculate_yacht_average_rating: {
        Args: { yacht_id_param: string }
        Returns: number
      }
      create_goods_receipt_accounting_entries: {
        Args: { p_purchase_order_id: string; p_received_items: Json }
        Returns: undefined
      }
      create_purchase_order_accounting_entries: {
        Args: { p_purchase_order_id: string }
        Returns: undefined
      }
      create_user_profile: {
        Args: {
          p_last_name?: string
          p_role?: Database["public"]["Enums"]["app_role"]
          p_email: string
          p_first_name?: string
          p_phone?: string
        }
        Returns: string
      }
      generate_adjustment_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_bond_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_contract_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_employee_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_expense_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_invoice_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_journal_entry_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_movement_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_payment_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_payroll_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_po_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_provision_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_transaction_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_year_end_entry_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_role: {
        Args: { user_id_param?: string }
        Returns: string
      }
      get_yacht_review_count: {
        Args: { yacht_id_param: string }
        Returns: number
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_admin_or_manager: {
        Args: { _user_id: string }
        Returns: boolean
      }
      is_admin_or_manager_user: {
        Args: { user_id_param?: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "manager" | "staff"
      booking_status:
        | "pending"
        | "confirmed"
        | "in_progress"
        | "completed"
        | "cancelled"
      expense_category:
        | "fuel"
        | "maintenance"
        | "insurance"
        | "supplies"
        | "marketing"
        | "staff"
        | "utilities"
        | "other"
      invoice_status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
      payment_method:
        | "cash"
        | "credit_card"
        | "bank_transfer"
        | "check"
        | "other"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      transaction_type: "income" | "expense" | "transfer"
      yacht_status: "available" | "maintenance" | "booked" | "out_of_service"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "manager", "staff"],
      booking_status: [
        "pending",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
      ],
      expense_category: [
        "fuel",
        "maintenance",
        "insurance",
        "supplies",
        "marketing",
        "staff",
        "utilities",
        "other",
      ],
      invoice_status: ["draft", "sent", "paid", "overdue", "cancelled"],
      payment_method: [
        "cash",
        "credit_card",
        "bank_transfer",
        "check",
        "other",
      ],
      payment_status: ["pending", "completed", "failed", "refunded"],
      transaction_type: ["income", "expense", "transfer"],
      yacht_status: ["available", "maintenance", "booked", "out_of_service"],
    },
  },
} as const
