import type { AnyScript, Context } from '../../Types'
import { Script } from '../Script'

export class GameStart extends Script {
  constructor(public name: string, private parentScriptsRef: AnyScript[]) {
    super(name)
  }

  update(ctx: Context): void {
    throw new Error('Method not implemented.')
  }
}
