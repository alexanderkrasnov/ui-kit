import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useMemo, useState } from 'react'

import { secondaryStorySurface } from '../../docs/story-surfaces'
import { InputOTP } from './InputOTP'
import { Spinner } from '../Spinner'

const authenticatorDescription = 'Enter the 6-digit code from your authenticator app'

const meta = {
  title: 'Forms/Input OTP',
  component: InputOTP,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[250px]">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    variant: { control: 'select', options: ['default', 'secondary'] },
    length: { control: 'number' },
    invalid: { control: 'boolean' },
    required: { control: 'boolean' },
  },
} satisfies Meta<typeof InputOTP>

export default meta
type Story = StoryObj<typeof meta>

export const Variants: Story = {
  render: () => (
    <div className="flex w-[250px] flex-col gap-5">
      <InputOTP
        label="Primary"
        defaultValue="123"
        description={authenticatorDescription}
        variant="default"
      />
      <div className={secondaryStorySurface}>
        <InputOTP
          label="Secondary"
          defaultValue="123"
          description={authenticatorDescription}
          variant="secondary"
        />
      </div>
    </div>
  ),
}

export const Default: Story = {
  args: {
    label: 'Verification code',
    description: authenticatorDescription,
  },
}

export const FourDigits: Story = {
  name: 'Four Digits',
  args: {
    label: 'PIN',
    length: 4,
  },
}

function ExampleDemo() {
  type ExampleStatus = 'idle' | 'verifying' | 'invalid'

  const [value, setValue] = useState('')
  const [status, setStatus] = useState<ExampleStatus>('idle')
  const isInvalid = status === 'invalid'

  useEffect(() => {
    const statusTimer = window.setTimeout(() => {
      setStatus(value.length === 6 ? 'verifying' : 'idle')
    }, 0)

    if (value.length !== 6) {
      return () => {
        window.clearTimeout(statusTimer)
      }
    }

    const invalidTimer = window.setTimeout(() => {
      setStatus('invalid')
    }, 2000)

    return () => {
      window.clearTimeout(statusTimer)
      window.clearTimeout(invalidTimer)
    }
  }, [value])

  const description = useMemo(() => {
    if (status === 'verifying') {
      return (
        <span key="verifying" className="input-otp-helper inline-flex items-center gap-2">
          <Spinner size="sm" aria-label="Verifying" />
          <span>Verifying...</span>
        </span>
      )
    }

    return (
      <span key="idle" className="input-otp-helper">
        {authenticatorDescription}
      </span>
    )
  }, [status])

  const errorMessage = useMemo(() => {
    if (!isInvalid) {
      return undefined
    }

    return (
      <span key="invalid" className="input-otp-helper">
        Invalid code. Please try again.
      </span>
    )
  }, [isInvalid])

  return (
    <InputOTP
      label="Verification code"
      value={value}
      onChange={setValue}
      invalid={isInvalid}
      errorMessage={errorMessage}
      description={description}
    />
  )
}

export const Example: Story = {
  render: () => <ExampleDemo />,
}
