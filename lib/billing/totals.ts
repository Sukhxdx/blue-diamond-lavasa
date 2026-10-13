export type BillLineInput = {
  unitPricePaise: number;
  quantity: number;
  gstBps: number;
};

export type BillTotals = {
  subtotalPaise: number;
  discountPaise: number;
  taxablePaise: number;
  cgstPaise: number;
  sgstPaise: number;
  totalPaise: number;
};

function assertInteger(value: number, label: string) {
  if (!Number.isInteger(value)) {
    throw new Error(`${label} must be an integer number of paise`);
  }
}

export function gstFromInclusive(inclusivePaise: number, gstBps: number) {
  assertInteger(inclusivePaise, "amount");
  assertInteger(gstBps, "gst");
  if (inclusivePaise < 0 || gstBps < 0) {
    throw new Error("amounts cannot be negative");
  }
  if (inclusivePaise === 0 || gstBps === 0) {
    return { taxablePaise: inclusivePaise, gstPaise: 0, cgstPaise: 0, sgstPaise: 0 };
  }
  const denominator = 10_000 + gstBps;
  const gstPaise = Math.floor((inclusivePaise * gstBps + Math.floor(denominator / 2)) / denominator);
  const cgstPaise = Math.floor(gstPaise / 2);
  return {
    taxablePaise: inclusivePaise - gstPaise,
    gstPaise,
    cgstPaise,
    sgstPaise: gstPaise - cgstPaise,
  };
}

export function calculateBill(lines: BillLineInput[], discountPaise: number): BillTotals {
  assertInteger(discountPaise, "discount");
  if (discountPaise < 0) throw new Error("discount cannot be negative");

  const groups = new Map<number, number>();
  let subtotalPaise = 0;
  for (const line of lines) {
    assertInteger(line.unitPricePaise, "price");
    assertInteger(line.quantity, "quantity");
    assertInteger(line.gstBps, "gst");
    if (line.unitPricePaise < 0 || line.quantity <= 0 || line.gstBps < 0) {
      throw new Error("invalid bill line");
    }
    const lineTotal = line.unitPricePaise * line.quantity;
    subtotalPaise += lineTotal;
    groups.set(line.gstBps, (groups.get(line.gstBps) ?? 0) + lineTotal);
  }
  if (discountPaise > subtotalPaise) throw new Error("discount exceeds subtotal");

  const rates = [...groups.keys()].sort((a, b) => a - b);
  const shares = new Map<number, number>();
  if (discountPaise === 0) {
    for (const rate of rates) shares.set(rate, 0);
  } else {
    let used = 0;
    for (const rate of rates) {
      const share = Math.floor((discountPaise * (groups.get(rate) ?? 0)) / subtotalPaise);
      shares.set(rate, share);
      used += share;
    }
    let remainder = discountPaise - used;
    const bySize = [...rates].sort((a, b) => (groups.get(b) ?? 0) - (groups.get(a) ?? 0) || a - b);
    while (remainder > 0) {
      let progressed = false;
      for (const rate of bySize) {
        const room = (groups.get(rate) ?? 0) - (shares.get(rate) ?? 0);
        if (room > 0) {
          shares.set(rate, (shares.get(rate) ?? 0) + 1);
          remainder -= 1;
          progressed = true;
          if (remainder === 0) break;
        }
      }
      if (!progressed) throw new Error("discount could not be allocated");
    }
  }

  let taxablePaise = 0;
  let cgstPaise = 0;
  let sgstPaise = 0;
  for (const rate of rates) {
    const net = (groups.get(rate) ?? 0) - (shares.get(rate) ?? 0);
    const split = gstFromInclusive(net, rate);
    taxablePaise += split.taxablePaise;
    cgstPaise += split.cgstPaise;
    sgstPaise += split.sgstPaise;
  }

  return {
    subtotalPaise,
    discountPaise,
    taxablePaise,
    cgstPaise,
    sgstPaise,
    totalPaise: subtotalPaise - discountPaise,
  };
}
